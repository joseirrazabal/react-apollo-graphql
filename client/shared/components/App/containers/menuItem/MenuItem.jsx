// @flow weak

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import * as viewsActions from '../../../../reducers/modules/views'
import { Protected } from '../../views'

const itemMenuInMutation = gql`
    mutation menuItem(
        $name: String!
        $title: Boolean
        $url: String
        $order: Int
        $icon: String
    ) {
        setMenuItem(
            name: $name
            title: $title
            url: $url
            order: $order
            icon: $icon
        ) {
            id
            name
            title
            url
            icon
            order
        }
    }
`

const itemMenuWithMutation = graphql(itemMenuInMutation, {
    name: 'itemMenuMutation',
    props: ({ ownProps, itemMenuMutation }) => ({
        mutateItem(user) {
            // nombre de la prop en vista
            // ownProps.setMutationLoading(); // dispatch accion (declarada en mapDispatchToProps )
            return itemMenuMutation(user)
                .then(({ data: { setMenuItem } }) => {
                    // ownProps.onUserLoggedIn(setMenuItem.title, setMenuItem.route);
                    // ownProps.unsetMutationLoading();
                    return Promise.resolve()
                })
                .catch(error => {
                    // ownProps.onUserLogError(error);
                    // ownProps.unsetMutationLoading();
                    return Promise.reject(error)
                })
        }
    })
})(Protected)

const mapStateToProps = state => {
    return {
        currentView: state.views.currentView
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            enterProtected: viewsActions.enterProtected,
            leaveProtected: viewsActions.leaveProtected
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(
    itemMenuWithMutation
)
