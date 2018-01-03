import React from 'react';
import { Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon } from "reactstrap";

export const renderField = ({
  input,
  label,
  type,
  placeholder,
  IconGroupAddon,
  meta: { touched, error, warning }
}) => {
  return (
    <InputGroup className="mb-3">
      {label &&
        <label>{label}</label>
      }

      {IconGroupAddon &&
        <InputGroupAddon><i className={IconGroupAddon}></i></InputGroupAddon>
      }

      <Input {...input} type={type} placeholder={placeholder} />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))
      }
    </InputGroup>
  )
}
