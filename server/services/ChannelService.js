import { DomainService,	METHOD_TYPES, DomainEntity,	IdType, StringType,	ListType, IntType, BooleanType } from "grpc-graphql-router-tools";

import services from "../src/grpc/protos/channel_grpc_pb";
import messages from "../src/grpc/protos/channel_pb";

const Channel = new DomainEntity({
	name: "Channel",
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
	name: "channel",
	messages: messages,
	services: services,
	methods: {
		getAll: {
			name: "channels",
			returnField: "items",
			type: new ListType(Channel),
			methodType: METHOD_TYPES.QUERY,
			args: {
				token: {
					type: StringType
				}
			}
		},
	}
})