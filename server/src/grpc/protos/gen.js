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

	var fileData = path.parse(path.join(file))

	let services = []
	let messages
	Object.keys(proto).map(async (serviceName) => {
		Object.keys(proto[serviceName]).map(async (key) => {
			if (proto[serviceName][key].service) {
				let funciones = []
				Object.keys(proto[serviceName][key].service).map(async (func) => {
					let request = []
					let requestName = proto[serviceName][key].service[func].requestType.name
					Object.keys(proto[serviceName][key].service[func].requestType.children).map(async (child) => {
						let name = proto[serviceName][key].service[func].requestType.children[child].name
						let type = proto[serviceName][key].service[func].requestType.children[child].type

						request.push({ name: name, type: type })
					})

					let response = []
					let responseName = proto[serviceName][key].service[func].responseType.name
					Object.keys(proto[serviceName][key].service[func].responseType.children).map(async (child) => {
						let fields = []

						// nombre objeto con campos 
						let nameField = proto[serviceName][key].service[func].responseType.children[child].name

						// si el campo no es repeat 
						if (!proto[serviceName][key].service[func].responseType.children[child].repeated) {
							let responseChild = { name: nameField, repeated: false, value: [] }

							let name = proto[serviceName][key].service[func].responseType.resolvedType.children[field].name
							let type = proto[serviceName][key].service[func].responseType.resolvedType.children[field].type.name

							responseChild.value.push({ name: name, type: type })
						} else {
							// nombre objeto con campos 
							let objName = proto[serviceName][key].service[func].responseType.children[child].resolvedType.name

							let responseChild = { nameRepeated: nameField, name: objName, repeated: true, value: [] }

							Object.keys(proto[serviceName][key].service[func].responseType.children[child].resolvedType.children).map(async (field) => {
								let name = proto[serviceName][key].service[func].responseType.children[child].resolvedType.children[field].name
								let type = proto[serviceName][key].service[func].responseType.children[child].resolvedType.children[field].type.name

								responseChild.value.push({ name: name, type: type })
							})
							response.push(responseChild)
						}
					})
					funciones.push({ name: func, requestName: requestName, requestValue: request, responseName: responseName, responseValue: response })
					messages = response
				})
				services.push({ name: key, value: funciones })
			}
		})
	});

	// console.log(JSON.stringify(services, null, 2))

	var entity
	messages.map(async message => {
		entity = `
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
	`
	})

	var domain
	services.map(async service => {
		let name = service.name

		service.value.map(func => {
			domain = `export default new DomainService({
			name: "${name}",
			messages: messages,
			services: services,
			methods: {
				${func.name}: {
					name: "${func.name}",
					${ func.responseValue[0].repeated ? 'returnField: "items",' : ''}
					type: new ListType(${func.responseValue[0].name}),
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
			}
		})
		`
		})
	})

	var stream = fs.createWriteStream(`services/${fileData.name}Service.js`);
	stream.once('open', function(fd) {
	  stream.write(`
		import { DomainService,	METHOD_TYPES, DomainEntity,	IdType, StringType,	ListType, IntType, BooleanType } from "grpc-graphql-router-tools";

		import services from "../${fileData.dir}/${fileData.name}_grpc_pb";
		import messages from "../${fileData.dir}/${fileData.name}_pb";
		${entity}
		${domain}
	  `);
	  stream.end();
	});
})