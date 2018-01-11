import React from 'react'
import TextField from 'material-ui/TextField'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'

const renderField = ({
    input,
    label,
    type,
    placeholder,
    IconGroupAddon,
    meta: { touched, error, warning }
}) => {
    return (
        <FormControl fullWidth error aria-describedby="name-error-text">
            { false && <InputLabel htmlFor="name-error">{label}</InputLabel> }
            <TextField
                id="with-placeholder"
                label={label}
                placeholder={placeholder}
                margin="normal"
                {...input}
            />
            {touched &&
                (error && (
                    <FormHelperText id="name-error-text">
                        {error}
                    </FormHelperText>
                ))}
        </FormControl>
    )
    /*
    return (
        <InputGroup className="mb-3">
            {label && <label>{label}</label>}

            {IconGroupAddon && (
                <InputGroupAddon>
                    <i className={IconGroupAddon} />
                </InputGroupAddon>
            )}

            <Input {...input} type={type} placeholder={placeholder} />
            {touched &&
                ((error && <span>{error}</span>) ||
                    (warning && <span>{warning}</span>))}
        </InputGroup>
    )
    */
}

export default renderField
