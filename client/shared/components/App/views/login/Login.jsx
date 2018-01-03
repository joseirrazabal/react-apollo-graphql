// @flow weak

import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form/immutable';
import { ErrorAlert } from '../../components';
import { renderField } from '../../components/Input';

import { Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon } from "reactstrap";

class Login extends PureComponent {
  static propTypes = {
    // react-router 4:
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,

    // views props:
    currentView: PropTypes.string.isRequired,
    enterLogin: PropTypes.func.isRequired,
    leaveLogin: PropTypes.func.isRequired,

    // apollo props:
    user: PropTypes.shape({
      username: PropTypes.string
    }),

    // auth props:
    userIsAuthenticated: PropTypes.bool.isRequired,
    mutationLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,

    // apollo actions
    loginUser: PropTypes.func.isRequired,

    // redux actions
    onUserLoggedIn: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired
  };

  state = {
    viewEntersAnim: true,
  };

  componentDidMount() {
    const { enterLogin } = this.props;
    enterLogin();
  }

  componentWillUnmount() {
    const { leaveLogin } = this.props;
    leaveLogin();
  }

  render() {
    const {
      viewEntersAnim,
    } = this.state;

    const { mutationLoading, handleSubmit, pristine, reset, submitting, error } = this.props;

    return (
      <div className={cx({ "view-enter": viewEntersAnim })}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="app flex-row align-items-center">
            <Container>
              <Row className="justify-content-center">
                <Col md="8">
                  <CardGroup className="mb-0">
                    <Card className="p-4">
                      <CardBody className="card-body">
                        <h1>Login</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <Field
                          name="email"
                          type="text"
                          component={renderField}
                          label=""
                          placeholder="Username"
                          className="form-control"
                          IconGroupAddon="icon-user"
                        />
                        <Field
                          name="password"
                          type="password"
                          component={renderField}
                          label=""
                          placeholder="Password"
                          className="form-control"
                          IconGroupAddon="icon-lock"
                        />
                        <Row>
                          <Col xs="12" className="text-right">
                            <Button
                              type="submit"
                              color="primary"
                              className="px-4"
                              disabled={pristine || submitting || mutationLoading}
                            >
                              Login
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </CardGroup>
                </Col>
              </Row>
              <ErrorAlert
                showAlert={!!error}
                errorTitle={'Error'}
                errorMessage={error ? error.message : ''}
                onClose={this.closeError}
              />
            </Container>
          </div>
        </form>
      </div>
    );
  }

  handleSubmit = async (values) => {
    const {
      loginUser,
      history,
    } = this.props;

    try {
      await loginUser({ variables: values });
      history.push({ pathname: '/protected' });
    } catch (error) {
      console.log('login went wrong..., error: ', error);
      // this.setState({
      //   error: { message: error.toString() },
      // });
    }
  }

  closeError = (event) => {
    event.preventDefault();
    const { resetError } = this.props;
    resetError();
  }
}

export default reduxForm({
  form: 'example',
})(Login);
