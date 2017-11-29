import fs from 'fs'
import path from 'path'
import grpc from 'grpc'
import capitalize from 'string-capitalize'


let filter = ["proto"]
async function ls(dirPath, filter = []) {
	let stat = await fs.statSync(dirPath)

	if (!stat.isDirectory()) {
		var data = path.parse(path.join(dirPath))
		if (filter.indexOf(data.ext.substr(1)) > -1) {
			return [dirPath]
		}
		return []
	}

	let filenames = []
	for (let name of await fs.readdirSync(dirPath)) {
		let result = await ls(path.join(dirPath, name), filter)
		filenames.push(...result)
	}

	return filenames
}

(async () => {
	let files = await ls("./src/grpc/protos/", filter)

	var protos = []
	files.map(file => {
		protos.push(grpc.load('./src/grpc/protos/channel.proto').channel);
	})

	let services = []
	let messages
	await protos.map(async proto => {
		await Object.keys(proto).map(async (key) => {
			if (proto[key].service) {
				let funciones = []
				await Object.keys(proto[key].service).map(async (func) => {
					let request = []
					let requestName = proto[key].service[func].requestType.name
					await Object.keys(proto[key].service[func].requestType.children).map(async (child) => {
						let name = proto[key].service[func].requestType.children[child].name
						let type = proto[key].service[func].requestType.children[child].type

						request.push({ name: name, type: type })
					})

					let response = []
					let responseName = proto[key].service[func].responseType.name
					await Object.keys(proto[key].service[func].responseType.children).map(async (child) => {
						let fields = []

						// nombre objeto con campos 
						let nameField = proto[key].service[func].responseType.children[child].name

						// si el campo no es repeat 
						if (!proto[key].service[func].responseType.children[child].repeated) {
							let responseChild = { name: nameField, repeated: false, value: [] }

							let name = proto[key].service[func].responseType.resolvedType.children[field].name
							let type = proto[key].service[func].responseType.resolvedType.children[field].type.name

							responseChild.value.push({ name: name, type: type })
						} else {
							// nombre objeto con campos 
							let objName = proto[key].service[func].responseType.children[child].resolvedType.name

							let responseChild = { nameRepeated: nameField, name: objName, repeated: true, value: [] }

							await Object.keys(proto[key].service[func].responseType.children[child].resolvedType.children).map(async (field) => {
								let name = proto[key].service[func].responseType.children[child].resolvedType.children[field].name
								let type = proto[key].service[func].responseType.children[child].resolvedType.children[field].type.name

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
		});
	})

	console.log(JSON.stringify(services, null, 2))

	var entity

	await messages.map(async message => {
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
	await services.map(async service => {
		let name = service.name

		service.value.map(func => {
			domain = `
		export default new DomainService({
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
					`
						${val.name}: {
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

	console.log(`
		import { DomainService,	METHOD_TYPES, DomainEntity,	IdType, StringType,	ListType, IntType, BooleanType } from "grpc-graphql-router-tools";
		${entity}
		${domain}
	`)

})();