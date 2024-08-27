import React, { Fragment } from 'react';
import FormField from './FormField';

const SchemaField = ({ formSchema, handleChange }) => {
  return (
    <Fragment>
      {formSchema.map((field) => (
        <div key={field.name} className={`form-field-container ${field.type}`}>
          <label htmlFor={field.name}>{field.label}</label>
          <FormField
            field={field}
            handleChange={(value) => {
              handleChange({ name: field.name, value });
            }}
          />
        </div>
      ))}
    </Fragment>
  );
};

export default SchemaField;
