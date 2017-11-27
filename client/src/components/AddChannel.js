import React from 'react';
import { gql, graphql } from 'react-apollo';

import { channelsListQuery } from './ChannelsListWithData';

const AddChannel = ({ mutate }) => {
	const handleKeyUp = (evt) => {
		if (evt.keyCode === 13) {
			mutate({
				variables: { name: evt.target.value },
				optimisticResponse: {
					addChannel: {
						name: evt.target.value,
						id: Math.round(Math.random() * -1000000),
						__typename: 'Channel',
					},
				},
				update: (store, { data: { addChannel } }) => {
					const data = store.readQuery({
						query: channelsListQuery,
						variables: { token: "prueba" }
					});
					data.channels.push(addChannel);
					store.writeQuery({ query: channelsListQuery, variables: { token: "prueba" }, data });
				},
			});
			evt.target.value = '';
		}
	};

	return (
		<input
			type="text"
			placeholder="New channel"
			onKeyUp={handleKeyUp}
		/>
	);
};

const addChannelMutation = gql`
  mutation addChannel($name: String!) {
    addChannel(name: $name) {
      id
      name
    }
  }
`;

const AddChannelWithMutation = graphql(
	addChannelMutation,
)(AddChannel);

export default AddChannelWithMutation;
