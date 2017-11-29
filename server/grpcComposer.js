import { DomainCompose } from "grpc-graphql-router-tools";

import ChannelService from "./services/ChannelService";

export default new DomainCompose({
	domainServices: {
		Channel: {
			type: ChannelService 
		}
	}
});