import { DomainCompose } from "grpc-graphql-router-tools";

import ChannelService from "./services/ChannelService";
import HotelsService from "./services/hotelsService";

export default new DomainCompose({
	domainServices: {
		Channel: {
			type: ChannelService 
		},
		Hotels: {
			type: HotelsService
		}
	}
});