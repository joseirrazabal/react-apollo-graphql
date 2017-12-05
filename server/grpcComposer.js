import { DomainCompose } from "grpc-graphql-router-tools";

import ChannelService from "./services/ChannelService";
// import FlyGuideService from "./services/FlyguideService";

export default new DomainCompose({
	domainServices: {
		Channel: {
			type: ChannelService 
		},
		// FlyGuide: {
		// 	type: FlyGuideService 
		// }
	}
});