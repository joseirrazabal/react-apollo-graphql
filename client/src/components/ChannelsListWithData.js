import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { gql, graphql } from 'react-apollo';

import AddChannel from './AddChannel';

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
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newChannel = subscriptionData.data.channelAdded;

        if (!prev.channels.find((msg) => msg.id === newChannel.id)) {
          return Object.assign({}, prev, {
            channels: [...prev.channels, newChannel]
          });
        } else {
          return prev;
        }
      }
    })
  }

  render() {
    const { data: {loading, error, channels } } = this.props;

    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }

    return (
      <div className="channelsList">
        <AddChannel />
        { channels.map( ch =>
          (<div key={ch.id} className={'channel ' + (ch.id < 0 ? 'optimistic' : '')}>
            <Link to={ch.id < 0 ? `/` : `channel/${ch.id}`}>
              {ch.name}
            </Link>
          </div>)
        )}
      </div>
    );
  }
}

export const channelsListQuery = gql`
  query ChannelsListQuery ($inpu: ChannelsInput) {
    channels(params: $inpu) {
		id
		name
    }
  }
`;

export default (graphql(channelsListQuery, {
  options: (props) => ({
    variables: { params: { token: "prueba" } },
  }),
})(ChannelsList));
