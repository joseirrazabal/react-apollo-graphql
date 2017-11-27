import { makeExecutableSchema, mergeSchemas } from 'graphql-tools'
import { makeExecutableSchema} from 'graphql-tools'

import GraphQLSchema from './schema.graphql'
import resolvers from './resolvers'

import grpcCompose from "../grpcComposer"

const LocalSchema = makeExecutableSchema({ typeDefs: [GraphQLSchema], resolvers })

const schema = mergeSchemas({
	schemas: [grpcCompose.schema, LocalSchema],
});

export { schema, LocalSchema }
