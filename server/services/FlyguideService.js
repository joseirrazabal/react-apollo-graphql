import { DomainService, METHOD_TYPES, DomainEntity, IdType, StringType, ListType, IntType, BooleanType } from "grpc-graphql-router-tools";

import services from "../src/grpc/protos/flyguide_grpc_pb";
import messages from "../src/grpc/protos/flyguide_pb";

const fly_id = new DomainEntity({
	name: "FlyId",
	fields: () => ({
		origin: {
			type: StringType
		},
		destiny: {
			type: StringType
		}
	})
});

const Fly = new DomainEntity({
	name: "Fly",
	fields: () => ({
		name: {
			type: StringType
		},
		description: {
			type: StringType
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
			args: {
				origin: {
					type: StringType
				}, 
				destiny: {
					type: StringType
				}
			}
		},

	}
})
