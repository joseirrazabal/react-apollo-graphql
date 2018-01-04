import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'
import { onError } from 'apollo-link-error'

// The ApolloClient takes its options as well as a network interface.
// function createApolloClient({ clientOptions = {}, networkInterface }) {
function createApolloClient() {
    // const options = Object.assign(
    //   {},
    //   {
    //     addTypeName: true,
    //     // DataIdFromObject is used by Apollo to identify unique entities from
    //     // your queries.
    //     dataIdFromObject: result =>
    //       // you might see o => o.id commonly with Apollo.
    //       // If the IDs are only unique per type (this is typical if an ID is just an
    //       // ID out of a database table), you can use the `__typename` field to scope it.
    //       // This is a GraphQL field that's automatically available, but you do need
    //       // to query for it also. @SEE: http://dev.apollodata.com/angular2/cache-updates.html#dataIdFromObject
    //       // eslint-disable-next-line no-underscore-dangle
    //       result.id && result.__typename
    //         ? `${result.__typename}${result.id}`
    //         : null
    //   },
    //   clientOptions
    // );

    const httpLink = new HttpLink({
        uri: '/graphql'
    })

    const middlewareLink = new ApolloLink((operation, forward) => {
        operation.setContext({
            headers: {
                authorization: localStorage.getItem('token') || null
            }
        })
        return forward(operation)
    })
    const httpLinkFinal = middlewareLink.concat(httpLink)

    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
            graphQLErrors.map(({ message, location, path }) =>
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${location}, Path: ${path}`
                )
            )
        if (networkError) console.log(`[Network error]: ${networkError}`)
    })

    if (typeof window !== 'undefined') {
        const wsLink = new WebSocketLink({
            uri: 'ws://localhost:4000/subscriptions',
            options: {
                reconnect: true,
                connectionParams: {
                    authorization: localStorage.getItem('token') || null
                }
            }
        })

        const link = split(
            ({ query }) => {
                const { kind, operation } = getMainDefinition(query)
                return (
                    kind === 'OperationDefinition' &&
                    operation === 'subscription'
                )
            },
            wsLink,
            httpLinkFinal
        )

        // const clientOptions = {
        //     initialState: preloadedState,
        //     ssrForceFetchDelay: 100,
        //     connectToDevTools: true
        // };

        return new ApolloClient({
            ssrForceFetchDelay: 100,
            connectToDevTools: true,
            link,
            cache: new InMemoryCache()
            // ...options,
        })
    } else {
        const queryOrMutationLink = (config = {}) =>
            new ApolloLink((operation, forward) => {
                operation.setContext({
                    credentials: 'same-origin',
                    headers: {
                        authorization: localStorage.getItem('token') || null
                    }
                })
                return forward(operation)
            }).concat(
                new HttpLink({
                    ...config
                })
            )

        return new ApolloClient({
            ssrMode: true,
            errorLink,
            link: ApolloLink.from([
                queryOrMutationLink({
                    fetch,
                    uri: `/graphql`
                })
            ]),
            cache: new InMemoryCache()
        })
    }
}

export default createApolloClient
