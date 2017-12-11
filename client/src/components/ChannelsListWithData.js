import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import AddChannel from './AddChannel';
import Fly from './Fly';
import Streaming from './streaming'

const channelsSubscription = gql`
    subscription channelAdded {
        channelAdded {
            id
            name
        }
    }
`

class ChannelsList extends Component {
	componentWillMount() {
		this.props.data.subscribeToMore({
			document: channelsSubscription,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) {
					return prev;
				}

				const newChannel = subscriptionData.data.channelAdded;

				if (!prev.channelsa.find((msg) => msg.id === newChannel.id)) {
					return Object.assign({}, prev, {
						channelsa: [...prev.channelsa, newChannel]
					});
				} else {
					return prev;
				}
			}
		})
	}

	render() {
		const { data: { loading, error, channelsa } } = this.props;

		if (loading) {
			return <p>Loading ...</p>;
		}
		if (error) {
			return <p>{error.message}</p>;
		}

		return (
			<div>
				<div className="floating-box">
					<div className="channelsList">
						<AddChannel />
						{channelsa && channelsa.map(ch =>
							(<div key={ch.id} className={'channel ' + (ch.id < 0 ? 'optimistic' : '')}>
								{ch.name}
							</div>)
						)}
					</div>
				</div>

				<div className="floating-box">
					<Fly />
				</div>

				<div className="floating-box">
					<Streaming />
				</div>
			</div>
		);
	}
}

export const channelsListQuery = gql`
    query ChannelsListQuery ($input: ChannelsaInput) {
        channelsa(params: $input) {
            id
            name
        }
    }
`;

export default (graphql(channelsListQuery, {
	options: (props) => ({
		variables: { input: { token: "prueba" } },
	}),
})(ChannelsList));
