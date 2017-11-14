import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Channel {
  id: ID!                # "!" denotes a required field
  name: String
  # messages: [Message]!
}

input MessageInput{
  channelId: ID!
  text: String
}

type Message {
  id: ID!
  text: String
}

# This type specifies the entry points into our API
type Query {
  channels: [Channel]    # "[]" means this is a list of channels
  channel(name: String!): Channel
}

# Error type.
type Error {
  key: String
  value: String
}
# user
type User {
  id: String
  username: String
  createdAt: String
  modifiedAt: String
  lastLogin: String
}
# Auth type.
type Auth {
  token: String
  user: User
  errors: [Error]
}

# The mutation root type, used to define all mutations
type Mutation {
  addChannel(name: String!): Channel
  addMessage(message: MessageInput!): Message
  logUser(email: String!, password: String!): Auth
}

# The subscription root type, specifying what we can subscribe to
type Subscription {
  channelAdded: Channel
  messageAdded(channelId: ID!): Message
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
