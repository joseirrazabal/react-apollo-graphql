import fs from 'fs'
import path from 'path'
import grpc from 'grpc'
import capitalize from 'string-capitalize'

(async () => {

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

	await files.map(file => {
		var proto = grpc.load(file);

		var fileData = path.parse(path.join(file))

		let services = []
		let messages = {}
		Object.keys(proto).map((serviceName) => {
			Object.keys(proto[serviceName]).map((key) => {
				let service = { name: key, functions: [] }

				if (proto[serviceName][key].service) {
					Object.keys(proto[serviceName][key].service).map((func) => {

						if (proto[serviceName][key].service[func].responseType.children.length == 1) {
							// retorno directamente un array o un objeto
							let objName = proto[serviceName][key].service[func].responseType.children[0].resolvedType.name
							let returnField = proto[serviceName][key].service[func].responseType.children[0].name
							let repeated = proto[serviceName][key].service[func].responseType.children[0].repeated
							let requestName = proto[serviceName][key].service[func].requestType.name
							let cant = proto[serviceName][key].service[func].responseType.children.length

							let functions = processFunctions(serviceName, func, objName, cant, returnField, repeated, requestName, proto[serviceName][key].service[func].requestType, messages)
							service.functions.push(functions)

							let mess = processMessage(objName, proto[serviceName][key].service[func].responseType.children, messages)

						} else {
							// retorno un objeto donde adentro va a tener un array o objeto con el resultado principal
							Object.keys(proto[serviceName][key].service[func].responseType.children).map((child) => {
								if (!proto[serviceName][key].service[func].responseStream) {
									// resulvo solo si la respuesta no es un stream
									let objName = proto[serviceName][key].service[func].responseType.children[child].resolvedType.name
									let returnField = proto[serviceName][key].service[func].responseType.children[child].name
									let repeated = proto[serviceName][key].service[func].responseType.children[child].repeated

									// devolver objeto response
									// let functions = processFunctions(serviceName, func, objName, returnField, repeated)
									// service.functions.push(functions)
								}
							})
						}
					})
					services.push(service)
				}
			})
		});

		// console.log(JSON.stringify(messages, null, 2))
		// console.log(JSON.stringify(services, null, 2))

		var domain = []
		services.map(service => {
			domain = `export default new DomainService({
			name: "${service.name}",
			messages: messages,
			services: services,
			methods: {`
			service.functions.map(func => {
				domain += `
				${func.name}: {
					name: "${func.name}",
					${func.returnField ? func.returnField : ''}
					${func.type}
					${func.methodType}
					${func.requestTypeName}
					args: {${func.request.map(param => `
							${param.name}: {
								${param.type}
							}`
					)}
					}
				},`
			})
			domain += `
			}
		})
		`
		})

		var entities = []
		Object.keys(messages).map(m => {
			let message = messages[m]
			entities.push(`
			const ${message.name} = new DomainEntity({
				name: "${message.name}",
				fields: () => ({${
				message.values.map(val => `
							${val.name}: {
								type: ${val.type}
							}`
				)}
				})
			});
		`)
		})

		var stream = fs.createWriteStream(`services/${fileData.name}Service.js`);
		stream.once('open', function (fd) {
			stream.write(`import { DomainService,	METHOD_TYPES, DomainEntity,	IdType, StringType,	ListType, IntType, BooleanType } from "grpc-graphql-router-tools";

				import services from "../${fileData.dir}/${fileData.name}_grpc_pb";
				import messages from "../${fileData.dir}/${fileData.name}_pb";

			`);

			entities.map(entity => {
				stream.write(`${entity}`)
			})

			stream.write(`
				${domain}`
			)

			stream.end();
		});
	})

	function variableToGraph(grpType) {
		switch (grpType) {
			case "uint32":
				return "int"
				break;
			case "int32":
				return "int"
				break;
			default:
				return grpType
				break;
		}
	}

	function processFunctions(serviceName, funcName, objName, cant, returnField, repeated, requestName, request, messages) {
		let message = {}

		let reqValues = []
		let reqName = request.name

		request.children.map(r => {
			if (r.resolvedType) {
				processMessage(r.resolvedType.name, r.resolvedType.children, messages, false)

				if (r.repeated) {
					reqValues.push({ name: r.name, type: `type: new ListType(${capitalize(variableToGraph(r.resolvedType.name))})` })
				} else {
					reqValues.push({ name: r.name, type: `type: ${capitalize(variableToGraph(r.resolvedType.name))}` })
				}
			} else {
				reqValues.push({ name: r.name, type: `type: ${capitalize(variableToGraph(r.type.name))}Type` })
			}
		})

		message.name = funcName
		message.type = repeated ? `type: new ListType(${objName}),` : `type: ${objName},`
		// si tengo un solo campo returno este
		message.returnField = cant == 1 ? `returnField: "${returnField}",` : false
		message.methodType = `methodType: METHOD_TYPES.QUERY,`
		message.requestTypeName = `requestTypeName: "${requestName}",`
		if (reqValues) {
			message.request = reqValues
		}

		return message
	}

	function processMessage(objName, children, messages, resolvedResponse = true) {
		let values = []

		children.map(childs => {
			if (resolvedResponse) {
				childs.resolvedType.children.map(child => {
					values.push({
						name: child.name,
						type: child.resolvedType ? (child.repeated ? 'new ListType(' : '') + child.resolvedType.name + (child.repeated ? ')' : '') : capitalize(variableToGraph(child.type.name)) + 'Type',
					})
					if (child.resolvedType && child.resolvedType.children) {
						processMessage(child.resolvedType.name, child.resolvedType.children, messages, false)
					}
				})
			} else {
				values.push({
					name: childs.name,
					type: childs.resolvedType ? (childs.repeated ? 'new ListType(' : '') + childs.resolvedType.name + (childs.repeated ? ')' : '') : capitalize(variableToGraph(childs.type.name)) + 'Type',
				})
				if (childs.resolvedType && childs.resolvedType.children) {
					processMessage(childs.resolvedType.name, childs.resolvedType.children, messages, false)
				}
			}
		})

		let message = {}
		message.name = objName
		message.values = values

		messages[objName] = message
	}

})();


