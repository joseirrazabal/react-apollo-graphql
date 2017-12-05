
		import { DomainService,	METHOD_TYPES, DomainEntity,	IdType, StringType,	ListType, IntType, BooleanType } from "grpc-graphql-router-tools";

		import services from "../src/grpc/protos/flyguide_grpc_pb";
		import messages from "../src/grpc/protos/flyguide_pb";

	  export default new DomainService({
			name: "FlyGuide",
			messages: messages,
			services: services,
			methods: {
				getFlys: {
					name: "getFlys",
					returnField: "items",
					type: new ListType(Fly),
					methodType: METHOD_TYPES.QUERY,
					args: {
						from: {
							type: MessageType
						}
						,	to: {
							type: MessageType
						}
						
					}
				},
		
				getFly: {
					name: "getFly",
					returnField: "items",
					type: new ListType(Fly),
					methodType: METHOD_TYPES.QUERY,
					args: {
						name_origin: {
							type: StringType
						}
						,	name_destiny: {
							type: StringType
						}
						
					}
				},
		
			}
		})
		
		const Fly = new DomainEntity({
			name: "Fly",
			fields: () => ({
			
				fly_id: {
					type: MessageType
				}
				,
				name: {
					type: StringType
				}
				,
				description: {
					type: StringType
				}
				,
				fly_number: {
					type: Int32Type
				}
				
			})
		});
	
		const fly_id = new DomainEntity({
			name: "fly_id",
			fields: () => ({
			
				name_origin: {
					type: StringType
				}
				,
				name_destiny: {
					type: StringType
				}
				
			})
		});
	