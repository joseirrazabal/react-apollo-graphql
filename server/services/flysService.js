import { DomainService, METHOD_TYPES, DomainEntity, IdType, StringType, ListType, IntType, BooleanType } from "grpc-graphql-router-tools";

import services from "../src/grpc/protos/flys_grpc_pb";
import messages from "../src/grpc/protos/flys_pb";


const Flyobj = new DomainEntity({
	name: "Flyobj",
	fields: () => ({
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
	name: "Flys",
	messages: messages,
	services: services,
	methods: {
		getFly: {
			name: "getFly",
			returnField: "flies",
			type: new ListType(Flyobj),
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
