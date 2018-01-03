import { withFilter } from 'graphql-subscriptions';
import jwtDecode from 'jwt-decode'
import pubsub from '../pubsub'

import connector from './connectors'
import { User, Channel, MenuItem } from './db/models'
import { ChannelService } from './grpc'
import { Error } from 'mongoose';
import getProjection from './projection';
import newObj from './newObj'

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
			let user = {}
			user.username = "usuario2"
			user.id = "1"
			user.username = "user"
			user.createdAt = Date()
			user.modifiedAt = Date()
			user.lastLogin = Date()
			return user

			// let projection = getProjection(context.fieldNodes[0])
			// return User.findById(id).select(projection).exec();
		},
		getRole: (root, { id }) => {
			return User.findOne({ id }).then((response) => response);
		},
		loggedInUser: async (_, args, { token }) => {
			const { id } = token && jwtDecode(token) || false
			if (id) {
				return User.findById(id).exec();
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
			return newObj(Channel, args, 'channelAdded')

			// const newChannel = new Channel(args);

			// pubsub.publish('channelAdded', { channelAdded: { id: newChannel._id, name: newChannel.name } } );

			// kafka
			// pubsub.publish({ 'channel': 'channelAdded', channelAdded: { id: newChannel._id, name: newChannel.name } });

			// return newChannel.save().then((response) => response);
		},
		setMenuItem: async (_, args, context) => {
			return newObj(MenuItem, args, 'menuItemAdded')
		},
		logUser(root, args) {
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
	},
	Subscription: {
		channelAdded: {
			subscribe: () => pubsub.asyncIterator('channelAdded')
		},
		menuItemAdded: {
			subscribe: () => pubsub.asyncIterator('menuItemAdded')
			// subscribe: withFilter(() => pubsub.asyncIterator('menuItemAdded'), (payload, variables) => {
			// 	return payload.credential === variables.credential;
			// }),
		},
	},
};

export default resolvers