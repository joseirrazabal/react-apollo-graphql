// @flow weak

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withApollo } from 'react-apollo'
import { Redirect, withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

class PrivateRoute extends Component {
    static propTypes = {
        // react-router 4:
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired, // con withRouter

        component: PropTypes.any.isRequired,
        path: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        currentUser: PropTypes.object
    }

    state = {
        navModel: {}
    }

    _isLoggedIn = () => {
        const { currentUser } = this.props
        return currentUser && currentUser.id !== null
    }

    render() {
        const { loading } = this.props

        if (loading) {
            return <div>Loading</div>
        }

        if (this._isLoggedIn()) {
            return this.renderLoggedIn()
        } else {
            return this.renderLoggedOut()
        }
    }

    renderLoggedIn() {
        const { navModel } = this.state
        const { component: Component, ...rest } = this.props
        return <Component {...this.props} />
    }

    renderLoggedOut() {
        const { location } = this.props
        return (
            <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
    }
}

const loggedUser = gql`
    query loggedInUser {
        loggedInUser {
            id
            username
        }
    }
`

export default graphql(loggedUser, {
    // name: 'user',
    options: {
        fetchPolicy: 'network-only',
        ssr: false
    },
    props: ({ data: { loading, loggedInUser } }) => ({
        loading,
        currentUser: loggedInUser
    })
})(withRouter(withApollo(PrivateRoute)))
