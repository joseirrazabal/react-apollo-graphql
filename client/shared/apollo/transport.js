// import { createNetworkInterface } from "react-apollo";
import merge from "lodash.merge";
import config from "../../config";
// import { createHybridNetworkInterface } from "./hybridNetworkInterface";

function createSimpleNetworkInterface(opts = {}, headers = {}) {
  // const richerOpts = merge(
  //   {},
  //   {
  //     uri: config("graphqlUri"),
  //     opts: {
  //       headers
  //     }
  //   },
  //   opts
  // );

  // const networkInterface = createNetworkInterface({ uri: config("graphqlUri") });

  // networkInterface.use([{
  //   applyMiddleware(req, next) {
  //     /* eslint-disable no-param-reassign */
  //     if (!req.options.headers) {
  //       req.options.headers = {};  // Create the header object if needed.
  //     }
  //     if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
  //       req.options.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  //     }

  //     next();
  //     /* eslint-enable no-param-reassign */
  //   },
  // }]);

  // return networkInterface
  // return createNetworkInterface(richerOpts);
}

function getNetworkInterface(opts = {}, headers = {}) {
  // Enable or disable query batching within your config file.
  // return config("graphqlBatch")
    // ? createHybridNetworkInterface(opts, headers)
    createSimpleNetworkInterface(opts, headers);
}

export default getNetworkInterface;
