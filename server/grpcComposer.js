import { DomainCompose } from "grpc-graphql-router-tools";

import ChannelService from "./services/channelService";
import HotelsService from "./services/hotelsService";
import FlyService from "./services/flyGuideService";

export default new DomainCompose({
	domainServices: {
		Channel: {
			type: ChannelService 
		},
		Hotels: {
			type: HotelsService
		},
		// nombre del servicio en el proto
		FlyGuide: {
			type: FlyService
		}
	}
});