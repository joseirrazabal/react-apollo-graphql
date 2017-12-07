import { DomainCompose } from "grpc-graphql-router-tools";

import ChannelService from "./services/ChannelService";
import HotelsService from "./services/hotelsService";
import FlyService from "./services/flysService";

export default new DomainCompose({
	domainServices: {
		Channel: {
			type: ChannelService 
		},
		Hotels: {
			type: HotelsService
		},
		Fly: {
			type: FlyService
		}
	}
});