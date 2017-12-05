import fs from 'fs'
import path from 'path'
import grpc from 'grpc'
import capitalize from 'string-capitalize'

let filter = ["proto"]
function ls(dirPath, filter = []) {
	let stat = fs.statSync(dirPath)

	if (!stat.isDirectory()) {
		var data = path.parse(path.join(dirPath))
		if (filter.indexOf(data.ext.substr(1)) > -1) {
			return [dirPath]
		}
		return []
	}

	let filenames = []
	for (let name of fs.readdirSync(dirPath)) {
		let result = ls(path.join(dirPath, name), filter)
		filenames.push(...result)
	}

	return filenames
}

let files = ls("./src/grpc/protos/", filter)

files.map(file => {
	var proto = grpc.load(file);
	var obj = []

	var fileData = path.parse(path.join(file))

	let services = []
	let messages = []
	Object.keys(proto).map(async (serviceName) => {
		Object.keys(proto[serviceName]).map(async (key) => {
			if (proto[serviceName][key].service) {
				let funciones = []
				let response = []

				Object.keys(proto[serviceName][key].service).map(async (func) => {
					let request = []
					let requestName = proto[serviceName][key].service[func].requestType.name

					if (proto[serviceName][key].service[func].requestType.children) {
						Object.keys(proto[serviceName][key].service[func].requestType.children).map(async (child) => {
							let name = proto[serviceName][key].service[func].requestType.children[child].name
							let type = proto[serviceName][key].service[func].requestType.children[child].type

							request.push({ name: name, type: type })
						})
					}
					// ----------------

					if (proto[serviceName][key].service[func].responseType.children.length == 1) {
						let returnField = proto[serviceName][key].service[func].responseType.children[0].name
						let repeated = proto[serviceName][key].service[func].responseType.children[0].repeated
						let objName = proto[serviceName][key].service[func].responseType.children[0].resolvedType.name

						let mess = processMessage(objName, returnField, repeated, proto[serviceName][key].service[func].responseType.children)
						obj[mess.name] = mess.values
						services.push(mess)
					}


					/*
					let responseName = proto[serviceName][key].service[func].responseType.name
					Object.keys(proto[serviceName][key].service[func].responseType.children).map(async (child) => {
						let fields = []

						// nombre objeto con campos 
						let nameField = proto[serviceName][key].service[func].responseType.children[child].name

						if (!proto[serviceName][key].service[func].responseType.children[child].repeated && proto[serviceName][key].service[func].responseType.children[child].resolvedType != null) {
							// crea en message los objetos 
							let responseChild = { name: nameField, repeated: false, value: [] }
							Object.keys(proto[serviceName][key].service[func].responseType.children[child].resolvedType.children).map(async (field) => {
								let name = proto[serviceName][key].service[func].responseType.children[child].resolvedType.children[field].name
								let type = proto[serviceName][key].service[func].responseType.children[child].resolvedType.children[field].type.name

								responseChild.value.push({ name: name, type: type })
							})
							messages.push(responseChild)

						} else if (!proto[serviceName][key].service[func].responseType.children[child].repeated) {
							// si el campo no es repeat 
							let responseChild = { name: nameField, repeated: false, value: [] }

							Object.keys(proto[serviceName][key].service[func].responseType.children[child].resolvedType.children).map(async (field) => {
								let name = proto[serviceName][key].service[func].responseType.children[child].resolvedType.children[field].name
								let type = proto[serviceName][key].service[func].responseType.children[child].resolvedType.children[field].type.name

								responseChild.value.push({ name: name, type: type })
							})

							let name = proto[serviceName][key].service[func].responseType.resolvedType.children[field].name
							let type = proto[serviceName][key].service[func].responseType.resolvedType.children[field].type.name

							responseChild.value.push({ name: name, type: type })
							// response.push(responseChild)
							messages.push(responseChild)
						} else if (proto[serviceName][key].service[func].responseType.children.length == 1) {
							// nombre objeto con campos 
							let objName = proto[serviceName][key].service[func].responseType.children[child].resolvedType.name

							let responseChild = { nameRepeated: nameField, name: objName, repeated: true, value: [] }

							Object.keys(proto[serviceName][key].service[func].responseType.children[child].resolvedType.children).map(async (field) => {
								let name = proto[serviceName][key].service[func].responseType.children[child].resolvedType.children[field].name
								let type = proto[serviceName][key].service[func].responseType.children[child].resolvedType.children[field].type.name

								responseChild.value.push({ name: name, type: type })
							})
							response.push(responseChild)
							messages.push(responseChild)
						}
					})
					*/
					// funciones.push({ name: func, requestName: requestName, requestValue: request, responseName: responseName, responseValue: response })
				})
				// services.push({ name: key, value: funciones })
			}
		})

	});
				

	console.log(JSON.stringify(services, null, 2))


	var entities = []
	messages.map(async message => {
		entities.push(`
		const ${message.name} = new DomainEntity({
			name: "${message.name}",
			fields: () => ({
			${
			message.value.map(val =>
				`
				${val.name}: {
					type: ${capitalize(val.type)}Type
				}
				`
			)
			}
			})
		});
	`)
	})

	var domain = []
	services.map(async service => {
		let name = service.name

		domain = `export default new DomainService({
			name: "${name}",
			messages: messages,
			services: services,
			methods: {`

		service.value.map(func => {
			let strType

			if (func.responseValue.length) {
				strType = `type: new ListType(${func.responseValue[0].name})`
			} else {
				strType = `type: ${func.responseName}`
			}
			domain += `
				${func.name}: {
					name: "${func.name}",
					${ func.responseValue[0] && func.responseValue[0].repeated ? 'returnField: "items",' : ''}
					${strType},
					methodType: METHOD_TYPES.QUERY,
					args: {
					${
				func.requestValue.map(val =>
					`	${val.name}: {
							type: ${capitalize(val.type.name)}Type
						}
						`
				)
				}
					}
				},
		`
		})

		domain += `
			}
		})
		`
	})

	var stream = fs.createWriteStream(`services/${fileData.name}Service.js`);
	stream.once('open', function (fd) {
		stream.write(`
		import { DomainService,	METHOD_TYPES, DomainEntity,	IdType, StringType,	ListType, IntType, BooleanType } from "grpc-graphql-router-tools";

		import services from "../${fileData.dir}/${fileData.name}_grpc_pb";
		import messages from "../${fileData.dir}/${fileData.name}_pb";

	  `);
		entities.map(entity => {
			stream.write(`${entity}`)
		})

		stream.write(`${domain}`)

		stream.end();
	});
})
	
function processMessage(objName, returnField, repeated, children) {
	let values = []
	children.map( childs => {
		childs.resolvedType.children.map( child  => {
			values.push({ 
				name: child.name, 
				type: child.type.name, 
				resolvedType: child.resolvedType && child.resolvedType.name ? child.resolvedType.name : null 
			})
		})
	})

	let message = {}
	message.name = objName
	message.repeated = repeated
	message.returnField = returnField 
	message.values = values

	return message
}
	