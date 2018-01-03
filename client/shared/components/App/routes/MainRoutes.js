// @flow weak

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  ConnectedLogin,
  ConnectedHome,
} from '../containers';

import PrivateRoute from '../components/privateRoute';
import LogoutRoute from '../components/logoutRoute';

import { PageNotFound } from '../views';

export const MainRoutes = () => (
  <Switch>
    <LogoutRoute path="/logout" />

    <Route path="/login" component={ConnectedLogin} />
    <Route path="/register" component={ConnectedLogin} />

    { /* <PrivateRoute exact path="/" component={ConnectedHome} /> */ }
    { /* <PrivateRoute path="/" component={ConnectedHome} /> */ }
    <PrivateRoute path="/dashboard" component={ConnectedHome} />
    <Redirect from="/" to="/dashboard" />

    <Route path="*" component={PageNotFound} />
  </Switch>
);

export default MainRoutes;
