import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  mergeSchemas
} from 'graphql-tools';

import { resolvers } from './resolvers';
import grpcCompose from "../grpcComposer";

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
# Role
type Role {
  id: String
  name: String
  createdAt: String
}

# Auth type.
type Auth {
  token: String
  user: User
  errors: [Error]
}

# This type specifies the entry points into our API
type Query {
  channel(name: String!): Channel
  getUser(id: ID!): User 
  getRole(id: ID!): Role
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

const LocalSchema = makeExecutableSchema({ typeDefs, resolvers });

 const schema = mergeSchemas({
    schemas: [ grpcCompose.schema, LocalSchema],
  });
export { schema };
