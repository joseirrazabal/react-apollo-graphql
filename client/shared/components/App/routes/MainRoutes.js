// @flow weak

import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { PageNotFound } from '../views'

import { Layout } from '../components'

import { PrivateRoute, Login, Logout, Home, MenuItem } from '../containers'

const routes = [
    {
        path: '/login',
        Component: Login,
        useLayout: false,
        isPrivate: false
    },
    {
        path: '/logout',
        Component: Logout,
        useLayout: false,
        isPrivate: false
    },
    {
        path: '/register',
        Component: Login,
        useLayout: false,
        isPrivate: false
    },
    {
        path: '/dashboard',
        Component: Home,
        useLayout: true,
        isPrivate: true
    },
    {
        path: '/menuItem',
        Component: MenuItem,
        useLayout: true,
        isPrivate: true
    },
    {
        path: '*',
        Component: PageNotFound,
        useLayout: false,
        isPrivate: false
    }
]

const AppRoute = ({ path, component: Component, isPrivate }) => {
    if (isPrivate) {
        return (
            <Layout>
                <PrivateRoute path={path} component={Component} />
            </Layout>
        )
    } else {
        return (
            <Route
                path={path}
                render={props => (
                    <Layout>
                        <Component {...props} />
                    </Layout>
                )}
            />
        )
    }
}

export const MainRoutes = () => (
    <Switch>
        <Redirect exact from="/" to="/dashboard" />

        {routes.map(({ path, useLayout, Component, isPrivate }) => {
            let RouteCustom = useLayout ? AppRoute : Route
            return (
                <RouteCustom
                    key={path}
                    path={path}
                    component={Component}
                    isPrivate={isPrivate}
                />
            )
        })}
    </Switch>
)

export default MainRoutes
