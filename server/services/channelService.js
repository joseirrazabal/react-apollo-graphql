import { DomainService, METHOD_TYPES, DomainEntity, IdType, StringType, ListType, IntType, BooleanType } from "grpc-graphql-router-tools";

import services from "../src/grpc/protos/channel_grpc_pb";
import messages from "../src/grpc/protos/channel_pb";

const Item = new DomainEntity({
	name: "Item",
	fields: () => ({
		id: {
			type: StringType
		},
		name: {
			type: StringType
		},
		description: {
			type: StringType
		}
	})
});

export default new DomainService({
	name: "Channel",
	messages: messages,
	services: services,
	methods: {
		getAll: {
			name: "getAll",
			returnField: "items",
			type: new ListType(Item),
			methodType: METHOD_TYPES.QUERY,
			args: {
				token: {
					type: StringType
				}
			}
		},
	}
})

