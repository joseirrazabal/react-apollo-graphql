/*
import {
  createBatchingNetworkInterface,
  createNetworkInterface
} from "apollo-client";
import merge from "lodash.merge";
import config from "../../config";

// The network interface is created for both the server and the client. For
// the most part they are the same, but have a few distinct properties specific
// to the environment (browser/server).
// --/
// The "hybrid" network interface we are creating here combines both interfaces for us.
// 1. Regular requests
// 2. Batch requests
// You can only use one type at a time, but switching is easy.
// Batching tells Apollo to combine multiple queries into a single request provided
// they are made within a specified amount of time.
// @SEE http://dev.apollodata.com/core/network.html#query-batching
export class HTTPHybridNetworkInterface {
  constructor(opts = {}, headers = {}) {
    const richerOpts = merge(
      {},
      {
        uri: config("graphqlUri"),
        opts: {
          headers
        }
      },
      opts
    );

    this.batchedInterface = createBatchingNetworkInterface(richerOpts);
    this.networkInterface = createNetworkInterface(richerOpts);
  }

  query(request) {
    // eslint-disable-next-line no-underscore-dangle
    if (request.variables && request.variables.__disableBatch) {
      return this.networkInterface.query(request);
    }

    return this.batchedInterface.query(request);
  }
  // Network interfaces have their own specific middleware and it's vital
  // to use the batching middleware for the batched network interface.
  use(middlewares) {
    this.networkInterface.use(middlewares);
    this.batchedInterface.use(middlewares);
    return this;
  }

  useAfter(afterwares) {
    this.networkInterface.useAfter(afterwares);
    this.batchedInterface.useAfter(afterwares);
    return this;
  }
}

export function createHybridNetworkInterface(opts = {}, headers = {}) {
  return new HTTPHybridNetworkInterface(opts, headers);
}
*/
