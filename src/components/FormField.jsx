import React, { useCallback, useMemo } from 'react';

const sanitizeValue = (target) => {
  const { value, type } = target;
  switch (type) {
    case 'number':
      return Number(value);
    default:
      return value;
  }
};

const FormField = ({ field, handleChange }) => {
  const { type, options, name, placeholder, fields } = field;

  const commonProps = useMemo(
    () => ({
      id: name,
      name,
      placeholder,
    }),
    [name, placeholder]
  );

  const onChange = useCallback(
    (e) => handleChange(sanitizeValue(e.target)),
    [handleChange]
  );

  switch (type) {
    case 'text':
      return <input type="text" onChange={onChange} {...commonProps} />;
    case 'checkbox':
      return <input type="checkbox" {...commonProps} onChange={onChange} />;
    case 'number':
      return <input type="number" onChange={onChange} {...commonProps} />;
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
  }
};

export default FormField;
