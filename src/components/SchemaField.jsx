import React, { Fragment } from 'react';
import FormField from './FormField';

const SchemaField = ({ formSchema, handleChange }) => {
  return (
    <Fragment>
      {formSchema.map((field) => (
        <div key={field.name} className={`flex flex-col gap-1.5`}>
          <label className="font-medium" htmlFor={field.name}>
            {field.label}
          </label>
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
