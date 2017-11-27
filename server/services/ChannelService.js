import {
	DomainService,
	METHOD_TYPES,
	DomainEntity,
	IdType,
	StringType,
	ListType,
	IntType,
	BooleanType
} from "grpc-graphql-router-tools";

import services from "../src/grpc/protos/channel_grpc_pb";
import messages from "../src/grpc/protos/channel_pb";

const ChannelConnection = new DomainEntity({
	name: "ItemResponse",
	fields: () => ({
		items: {
			type: new ListType(Channel)
		}
	})
});

const Channel = new DomainEntity({
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
	name: "channel",
	messages: messages,
	services: services,
	methods: {
		getAll: {
			name: "Channels",
			type: ChannelConnection,
			methodType: METHOD_TYPES.QUERY,
			requestTypeName: "Params",
			args: {
				params: {
					type: IntType
				},
			}
		},
	}
})