// @flow weak

/* eslint no-unused-vars:0 */
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as viewsActions from '../../../../reducers/modules/views'
import * as userAuthActions from '../../../../reducers/modules/userAuth'
import { Login } from '../../views'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/
// const loginUser = gql`
//   mutation LoginUser($user: LoginUserInput!) {
//     loginUser(input: $user) {
//       token,
//       user {
//         id,
//         username,
//         createdAt,
//         modifiedAt,
//         lastLogin
//       }
//     }
//   }
// `;

const loginUser = gql`
    mutation logUser($email: String!, $password: String!) {
        logUser(email: $email, password: $password) {
            token
            user {
                id
                username
                createdAt
                modifiedAt
                lastLogin
            }
        }
    }
`
// 1- add queries:

// 2- add mutation "logUser":
const LoginWithMutation = graphql(loginUser, {
    name: 'loginUserMutation',
    props: ({ ownProps, loginUserMutation }) => ({
        loginUser(user) {
            ownProps.setMutationLoading()

            return loginUserMutation(user)
                .then(({ data: { logUser } }) => {
                    ownProps.onUserLoggedIn(logUser.token, logUser.user)
                    ownProps.unsetMutationLoading()
                    return Promise.resolve()
                })
                .catch(error => {
                    ownProps.onUserLogError(error)
                    ownProps.unsetMutationLoading()
                    return Promise.reject()
                })
        }
    })
})(Login)

/*
const loginUser = gql`
  mutation LoginUser($user: LoginUserInput!) {
    loginUser(input: $user) {
      token,
      user {
        id,
        username,
        createdAt,
        modifiedAt,
        lastLogin
      }
    }
  }
`;

// 1- add queries:

// 2- add mutation "logUser":
const LoginWithMutation = graphql(
  loginUser,
  {
    name: 'logUserMutation',
    props: ({ ownProps, logUserMutation }) => ({
      loginUser(user) {
        ownProps.setMutationLoading();

        return logUserMutation(user)
          .then(
            (
              {
                data: {
                  loginUser
                }
              }
            ) => {
              ownProps.onUserLoggedIn(loginUser.token, loginUser.user);
              ownProps.unsetMutationLoading();
              return Promise.resolve();
            }
          )
          .catch(
            (error)=> {
              ownProps.onUserLogError(error);
              ownProps.unsetMutationLoading();
              return Promise.reject();
            }
          );
      }
    })
  }
)(Login);
*/

/* -----------------------------------------
  Redux
 ------------------------------------------*/

const mapStateToProps = state => {
    return {
        // views props:
        currentView: state.views.currentView,
        // user Auth props:
        userIsAuthenticated: state.userAuth.isAuthenticated,
        mutationLoading: state.userAuth.mutationLoading,
        // errors:
        error: state.userAuth.error
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            // views actions:
            enterLogin: viewsActions.enterLogin,
            leaveLogin: viewsActions.leaveLogin,

            // userAuth actions:
            onUserLoggedIn: userAuthActions.receivedUserLoggedIn,
            onUserLogError: userAuthActions.errorUserLoggedIn,
            setMutationLoading: userAuthActions.setLoadingStateForUserLogin,
            unsetMutationLoading: userAuthActions.unsetLoadingStateForUserLogin,
            resetError: userAuthActions.resetLogError
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithMutation)
