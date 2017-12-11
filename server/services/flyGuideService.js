import { DomainService,	METHOD_TYPES, DomainEntity,	IdType, StringType,	ListType, IntType, BooleanType } from "grpc-graphql-router-tools";

				import services from "../src/grpc/protos/flyGuide_grpc_pb";
				import messages from "../src/grpc/protos/flyGuide_pb";

			
			const FlyId = new DomainEntity({
				name: "FlyId",
				fields: () => ({
							nameOrigin: {
								type: StringType
							},
							nameDestiny: {
								type: StringType
							}
				})
			});
		
			const Fly = new DomainEntity({
				name: "Fly",
				fields: () => ({
							flyId: {
								type: FlyId
							},
							name: {
								type: StringType
							},
							description: {
								type: StringType
							},
							flyNumber: {
								type: IntType
							}
				})
			});
		
				export default new DomainService({
			name: "FlyGuide",
			messages: messages,
			services: services,
			methods: {
				getFly: {
					name: "getFly",
					returnField: "flies",
					type: new ListType(Fly),
					methodType: METHOD_TYPES.QUERY,
					requestTypeName: "FlyId",
					args: {
							nameOrigin: {
								type: StringType
							},
							nameDestiny: {
								type: StringType
							}
					}
				},
			}
		})
		