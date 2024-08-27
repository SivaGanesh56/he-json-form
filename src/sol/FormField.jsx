import React, { useCallback, useMemo } from 'react';
import SchemaField from './SchemaField';

const sanitizeValue = (target) => {
  const { value, type, checked } = target;
  switch (type) {
    case 'checkbox':
      return checked;
    case 'number':
      return Number(value);
    default:
      return value;
  }
};

const FormField = ({ field, handleChange }) => {
  const { type, options, name, placeholder, fields, required, disabled } =
    field;

  const commonProps = useMemo(
    () => ({
      id: name,
      name,
      placeholder,
      required,
      disabled,
    }),
    [name, placeholder, required, disabled]
  );

  const onChange = useCallback(
    (e) => handleChange(sanitizeValue(e.target)),
    [handleChange]
  );

  switch (type) {
    case 'text':
      return <input type="text" onChange={onChange} {...commonProps} />;
    case 'select':
      return (
        <select onChange={onChange} {...commonProps}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case 'checkbox':
      return <input type="checkbox" {...commonProps} onChange={onChange} />;
    // TODO: remove this field
    case 'number':
      return <input type="number" onChange={onChange} {...commonProps} />;
    case 'radio':
      return (
        <div {...commonProps}>
          {options.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name={name}
                value={option.value}
                onChange={onChange}
              />
              {option.label}
            </label>
          ))}
        </div>
      );
    case 'object':
      return (
        <SchemaField
          formSchema={fields}
          handleChange={({ name, value }) => handleChange({ [name]: value })}
        />
      );
  }
};

export default FormField;
