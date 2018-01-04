// @flow weak

import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import {
    ConnectedLogin,
    ConnectedHome,
    ConnectedProtected
} from '../containers'

import PrivateRoute from '../components/privateRoute'
import LogoutRoute from '../components/logoutRoute'

import { PageNotFound } from '../views'

export const MainRoutes = () => (
    <Switch>
        <LogoutRoute path="/logout" />

        <Route path="/login" component={ConnectedLogin} />
        <Route path="/register" component={ConnectedLogin} />

        {/* <Route exact path="/" component={ConnectedHome} /> */}
        <Redirect exact from="/" to="/dashboard" />
        <PrivateRoute path="/dashboard" component={ConnectedHome} />
        <PrivateRoute path="/about" component={ConnectedProtected} />

        <Route path="*" component={PageNotFound} />
    </Switch>
)

export default MainRoutes
