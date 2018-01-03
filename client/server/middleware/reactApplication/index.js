import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import StaticRouter from "react-router-dom/StaticRouter";
import {
  AsyncComponentProvider,
  createAsyncContext
} from "react-async-component";
import asyncBootstrapper from "react-async-bootstrapper";
import Helmet from "react-helmet";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import configureStore from "../../../shared/redux/configureStore";
import {
  createApolloClient,
  getNetworkInterface
} from "../../../shared/apollo";
import config from "../../../config";
import App from "../../../shared/components/App";
import ServerHTML from "./ServerHTML";

import { JobProvider, createJobContext } from 'react-jobs';
import { Provider } from 'react-redux';
import { log } from '../../../internal/utils';

/**
 * React application middleware, supports server side rendering.
 */
export default (async function reactApplicationMiddleware(request, response) {
  // Ensure a nonce has been provided to us.
  // See the server/middleware/security.js for more info.
  if (typeof response.locals.nonce !== "string") {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = response.locals.nonce;

  // Apollo setup
  // all options described below
  // @see http://dev.apollodata.com/core/apollo-client-api.html#constructor
  const clientOptions = {
    // SSR mode prevents both the server and the client requesting the same data --
    // stops you from making two requests for the same data.
    ssrMode: true
  };

  // Network interface is responsible for fetching your data. It makes the request using
  // the network connection.
  // Using something like https://github.com/af/apollo-local-query or
  // https://github.com/sysgears/persistgraphql-webpack-plugin allows you to perform
  // queries without making a network request.
  // Pass our headers to the networkInterface so that we can set headers / provide cookie or token.
  const networkInterface = getNetworkInterface(clientOptions, request.headers);

  // const apolloClient = createApolloClient({
    // request,
    // clientOptions,
    // networkInterface
  // });
  const apolloClient = createApolloClient()

  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (config("disableSSR")) {
    if (process.env.BUILD_FLAG_IS_DEV === "true") {
      // eslint-disable-next-line no-console
      log({
        title: 'Server',
        level: 'info',
        message: `Handling react route without SSR: ${request.url}`,
      });
    }
    // SSR is disabled so we will return an "empty" html page and
    // rely on the client to initialize and render the react application.
    const html = renderToStaticMarkup(<ServerHTML nonce={nonce} />);
    response.status(200).send(`<!DOCTYPE html>${html}`);
    return;
  }

  // Create a context for our AsyncComponentProvider.
  const asyncContext = createAsyncContext();

  // Create a context for <StaticRouter>, which will allow us to
  // query for the results of the render.
  const reactRouterContext = {};

  const initialState = {};
  // Create the redux store.
  const store = configureStore(apolloClient, initialState);

  // Declare our React application.
  const app = (
    <AsyncComponentProvider asyncContext={asyncContext}>
      <StaticRouter location={request.url} context={reactRouterContext}>
        <ApolloProvider client={apolloClient}>
          <Provider store={store}>
            <App />
          </Provider>
        </ApolloProvider>
      </StaticRouter>
    </AsyncComponentProvider >
  );

  // Traverses entire React tree and determines which queries are needed to render, then
  // fetches the data. It returns a promise which resolves when the data is ready in
  // your Apollo Client store.
  // @SEE http://dev.apollodata.com/react/server-side-rendering.html
  await getDataFromTree(app);

  // Pass our app into the react-async-component helper so that any async
  // components are resolved for the render.
  asyncBootstrapper(app).then(() => {
    const appString = renderToString(app);

    const html = renderToStaticMarkup(
      <ServerHTML
        reactAppString={appString}
        nonce={nonce}
        helmet={Helmet.rewind()}
        storeState={store.getState()}
        routerState={reactRouterContext}
        asyncComponentsState={asyncContext.getState()}
      />
    );

    // Check if the router context contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (reactRouterContext.url) {
      response.status(302).setHeader("Location", reactRouterContext.url);
      response.end();
      return;
    }

    response
      .status(
      reactRouterContext.missed
        ? // If the renderResult contains a "missed" match then we set a 404 code.
        // Our App component will handle the rendering of an Error404 view.
        404
        : // Otherwise everything is all good and we send a 200 OK status.
        200,
    )
      .send(`<!DOCTYPE html>${html}`);
  });
});
