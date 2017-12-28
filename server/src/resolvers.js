import { withFilter } from 'graphql-subscriptions';
import pubsub from '../pubsub'

import connector from './connectors'
import { User, Channel, MenuItem } from './db/models'
import { ChannelService } from './grpc'
import { Error } from 'mongoose';
import getProjection from './projection';

const resolvers = {
	Query: {
		channelsa: (root, { params }) => {
			// return (await ChannelService.getAllAsync({ token: params.token })).items || []

			return new Promise((resolve, reject) => {
				var result = []

				var call = ChannelService.prueba({ token: params && params.token || '' })
				call.on('data', function (item) {
					result.push(item)
					// pubsub.publish({ 'channel': 'channelAdded', channelAdded: item });
				});
				call.on('end', function () {
					return resolve(result)
				})
			})

			// return Channel.find({}).then((response) => { return response });
		},
		channel: (root, { name }) => {
			return Channel.findOne({ name }).then((response) => response);
		},
		getUser: (root, { id }, options, context) => {
			let projection = getProjection(context.fieldNodes[0])

			return User.findById(id).select(projection).exec();
		},
		getRole: (root, { id }) => {
			return User.findOne({ id }).then((response) => response);
		},
		loggedInUser: (_, args, { token }) => {
			// const { id } = token
			// if (!id) {
			// 	return Error("Sin token")
			// }
			if (token) {
				return User.findById("5a0a0f23491dc4c84cf310e1").exec();
			}
			return {}
		},
		getAllMenuItem: (_, args, { token }, context) => {
			let projection = getProjection(context.fieldNodes[0])

			return MenuItem.find().select(projection).sort("order").exec();
		}
	},
	Mutation: {
		addChannel: async (root, args) => {
			const ChannelModel = new Channel(args);
			const newChannel = await ChannelModel.save();

			if (!newChannel) {
				throw new Error('Error adding new channel');
			}

			// kafka (subscription)
			pubsub.publish({ 'channel': 'channelAdded', channelAdded: { id: newChannel._id, name: newChannel.name } });

			return newChannel
		},
		addMessage: (root, { message }) => {
			const channel = channels.find(channel => channel.id === message.channelId);
			if (!channel)
				throw new Error("Channel does not exist");

			// const newMessage = { id: String(nextMessageId++), text: message.text };
			// channel.messages.push(newMessage);

			// pubsub.publish('messageAdded', { messageAdded: newMessage, channelId: message.channelId });

			// return newMessage;
		},
		logUser(root, args) {
			console.log("bien")
			const errors = [];

			return connector.Auth.signIn(args)
				.then(token => {
					let user = {}
					user.username = "usuario2"
					user.id = "1"
					user.username = "user"
					user.createdAt = Date()
					user.modifiedAt = Date()
					user.lastLogin = Date()

					return ({
						token,
						user,
						errors
					})
				})
				.catch((err) => {
					if (err.code && err.message) {
						errors.push({
							key: err.code,
							value: err.message
						});

						return { token: null, errors };
					}

					throw new Error(err);
				});
		},
		setMenuItem: (root, args) => {
			const newMenuItem = new MenuItem(args);

			return newMenuItem.save().then((response) => response);
		}
	},
	Subscription: {
		channelAdded: {
			subscribe: () => pubsub.asyncIterator('channelAdded')
			// subscribe: withFilter(() => pubsub.asyncIterator('channelAdded'), (payload, variables) => {
			// return payload.name === variables.name;
			// return payload;
		},
		messageAdded: {
			subscribe: withFilter(() => pubsub.asyncIterator('messageAdded'), (payload, variables) => {
				// The `messageAdded` channel includes events for all channels, so we filter to only
				// pass through events for the channel specified in the query
				return payload.channelId === variables.channelId;
			}),
		}
	},
};

export default resolvers