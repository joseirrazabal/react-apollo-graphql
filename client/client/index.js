/* eslint-disable global-require, no-underscore-dangle */
// we need a fetch polyfill for both the browser and server for Apollo.
import "isomorphic-fetch/fetch-npm-browserify";
import React from "react";
import { render } from "react-dom";
import BrowserRouter from "react-router-dom/BrowserRouter";
import asyncBootstrapper from "react-async-bootstrapper";
import { AsyncComponentProvider } from "react-async-component";
import { ApolloProvider } from "react-apollo";
import configureStore from "../shared/redux/configureStore";
import { createApolloClient } from "../shared/apollo";
import { Provider } from 'react-redux';

import { ScrollToTop } from '../shared/components/App/components';

import "./polyfills";

import ReactHotLoader from "./components/ReactHotLoader";
import App from "../shared/components/App";

// Get the DOM Element that will host our React application.
const container = document.querySelector("#app");

const preloadedState = window.__APOLLO_STATE__;

// Apollo setup
// all options described below
// @see http://dev.apollodata.com/core/apollo-client-api.html#constructor
const clientOptions = {
  initialState: preloadedState,
  ssrForceFetchDelay: 100,
  connectToDevTools: true
};
const apolloClient = createApolloClient({
  // clientOptions,
  // networkInterface: getNetworkInterface(),
});

// Create our Redux store.
const store = configureStore(
  apolloClient,
  // Server side rendering would have mounted our state on this global.
  preloadedState
);

// Does the user's browser support the HTML5 history API?
// If the user's browser doesn't support the HTML5 history API then we
// will force full page refreshes on each page change.
const supportsHistory = "pushState" in window.history;

// Get any rehydrateState for the async components.
// eslint-disable-next-line no-underscore-dangle
const asyncComponentsRehydrateState =
  window.__ASYNC_COMPONENTS_REHYDRATE_STATE__;

/**
 * Renders the given React Application component.
 */
function renderApp(TheApp) {
  // Firstly, define our full application component, wrapping the given
  // component app with a browser based version of react router.
  const app = (
    <ReactHotLoader>
      <AsyncComponentProvider rehydrateState={asyncComponentsRehydrateState}>
        <ApolloProvider client={apolloClient}>
          <Provider store={store}>
            <BrowserRouter forceRefresh={!supportsHistory}>
              <ScrollToTop>
                <TheApp />
              </ScrollToTop>
            </BrowserRouter>
          </Provider>
        </ApolloProvider>
      </AsyncComponentProvider >
    </ReactHotLoader >
  );

  // We use the react-async-component in order to support code splitting of
  // our bundle output. It's important to use this helper.
  // @see https://github.com/ctrlplusb/react-async-component
  asyncBootstrapper(app).then(() => render(app, container));
}

// Execute the first render of our app.
renderApp(App);

// This registers our service worker for asset caching and offline support.
// Keep this as the last item, just in case the code execution failed (thanks
// to react-boilerplate for that tip.)
require("./registerServiceWorker");

// The following is needed so that we can support hot reloading our application.
if (process.env.BUILD_FLAG_IS_DEV === "true" && module.hot) {
  module.hot.dispose(data => {
    // Deserialize store and keep in hot module data for next replacement
    data.store = stringify(toJS(store)); // eslint-disable-line
  });

  // Accept changes to this file for hot reloading.
  module.hot.accept("./index.js");
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept("../shared/components/App", () => {
    renderApp(require("../shared/components/App").default);
  });
}
