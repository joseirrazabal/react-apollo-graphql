// @flow weak

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form/immutable'
import { translate } from 'react-i18next'
import cx from 'classnames'

import Button from 'material-ui/Button'
import Save from 'material-ui-icons/Save'
import { MenuItem } from 'material-ui/Menu'
import Radio, { RadioButton } from 'material-ui/Radio'
import { FormControlLabel } from 'material-ui/Form'

import {
    Checkbox,
    RadioGroup,
    Select,
    TextField,
    Switch
} from 'redux-form-material-ui'

import { renderField, ErrorAlert } from '../../components'

class Protected extends PureComponent {
    static propTypes = {
        // react-router 4:
        history: PropTypes.object.isRequired,

        // views
        enterProtected: PropTypes.func.isRequired,
        leaveProtected: PropTypes.func.isRequired,
        mutateItem: PropTypes.func.isRequired
    }

    state = {
        viewEntersAnim: true
    }

    constructor(props) {
        super(props)
        this.state = { error: false }
    }

    componentDidMount() {
        const { enterProtected } = this.props
        enterProtected()
    }

    componentWillUnmount() {
        const { leaveProtected } = this.props
        leaveProtected()
    }

    handleSubmit = async values => {
        const { mutateItem, history, reset } = this.props

        try {
            await mutateItem({ variables: values })
            reset()
            history.push({ pathname: '/dashboard' })
        } catch (error) {
            this.setState({
                error: { message: error.toString() }
            })
        }
    }

    closeError = event => {
        event.preventDefault()
        this.setState({
            error: false
        })
    }

    render() {
        const {
            handleSubmit,
            pristine,
            reset,
            submitting,
            mutationLoading,
            error,
            t
        } = this.props
        const { viewEntersAnim } = this.state

        return (
            <div className={cx({ 'view-enter': viewEntersAnim })}>
                <form onSubmit={handleSubmit(this.handleSubmit)}>
                    <ErrorAlert
                        showAlert={!!this.state && this.state.error}
                        errorTitle={'Error'}
                        errorMessage={
                            this.state && this.state.error
                                ? this.state.error.message
                                : ''
                        }
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
                            label={t('orden')}
                            placeholder={t('orden')}
                        />
                    </div>
                    <Field
                        name="plan"
                        component={Select}
                        placeholder="Select a plan"
                    >
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                        <MenuItem value="lifetime">Lifetime</MenuItem>
                    </Field>
                    <FormControlLabel
                        control={
                            <Field name="agreeToTerms" component={Checkbox} />
                        }
                        label="Agree to terms?"
                    />
                    <FormControlLabel
                        control={
                            <Field name="receiveEmails" component={Switch} />
                        }
                        label="Please spam me!"
                    />
                    <Field name="bestFramework" component={RadioGroup}>
                        <Radio value="react" label="React" />
                        <Radio value="angular" label="Angular" />
                        <Radio value="ember" label="Ember" />
                    </Field>

                    <Button
                        type="submit"
                        disabled={pristine || submitting || mutationLoading}
                        raised
                        color="primary"
                    >
                        <Save />
                        {t('prueba')}
                    </Button>
                    <Button
                        disabled={pristine || submitting}
                        raised
                        color="accent"
                        onClick={reset}
                    >
                        {t('asdf')}
                    </Button>
                </form>
            </div>
        )
    }
}

const validate = values => {
    const errors = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    return errors
}

const Pretected = reduxForm({
    form: 'example',
    validate
})(Protected)

export default translate()(Pretected)
