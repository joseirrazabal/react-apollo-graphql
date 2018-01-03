// @flow weak

import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field, reduxForm } from 'redux-form/immutable';

import { renderField } from '../../components/Input';
import { ErrorAlert } from '../../components';

class Protected extends PureComponent {
  static propTypes = {
    // react-router 4:
    history: PropTypes.object.isRequired,

    // views
    enterProtected: PropTypes.func.isRequired,
    leaveProtected: PropTypes.func.isRequired,
    mutateItem: PropTypes.func.isRequired,
  };

  state = {
    viewEntersAnim: true,
  };

  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidMount() {
    const { enterProtected } = this.props;
    enterProtected();
  }

  componentWillUnmount() {
    const { leaveProtected } = this.props;
    leaveProtected();
  }

  handleSubmit = async (values) => {
    const {
      mutateItem,
      history,
      reset,
    } = this.props;

    try {
      await mutateItem({ variables: values });
      reset();
      history.push({ pathname: '/dashboard' });
    } catch (error) {
      this.setState({
        error: { message: error.toString() },
      });
    }
  }

  closeError = (event) => {
    event.preventDefault();
    this.setState({
      error: false,
    });
  }

  render() {
    const { handleSubmit, pristine, reset, submitting, mutationLoading, error } = this.props;
    const { viewEntersAnim } = this.state;

    return (
      <div className={cx({ "view-enter": viewEntersAnim })}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ErrorAlert
            showAlert={!!this.state && this.state.error}
            errorTitle={'Error'}
            errorMessage={this.state && this.state.error ? this.state.error.message : ''}
            onClose={this.closeError}
          />
          <div>
            <Field
              name="name"
              type="text"
              component={renderField}
              label="Nombre"
              placeholder="Nombre"
            />
            <Field
              name="title"
              type="checkbox"
              component={renderField}
              label="Titulo"
              placeholder="Titulo"
            />
            <Field
              name="url"
              type="text"
              component={renderField}
              label="Ruta"
              placeholder="Ruta"
            />
            <Field
              name="icon"
              type="text"
              component={renderField}
              label="Icono"
              placeholder="Icono"
            />
            <Field
              name="order"
              type="number"
              component={renderField}
              label="Orden"
              placeholder="Orden"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={pristine || submitting || mutationLoading}>Submit</button>
          <button type="button" className="btn btn-default" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
        </form>
      </div>
    );
  }
}

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Required';
  }

  return errors;
};

export default reduxForm({
  form: 'example',
  validate,
})(Protected);
