import React, { useCallback, useMemo } from 'react';

const FIELD_CLASSES =
  'border rounded min-w-[250px] p-1.5 border-solid border-[#ccc]';

const sanitizeValue = (target) => {
  const { value, type, checked } = target;
  switch (type) {
    case 'number':
      return Number(value);
    case 'checkbox':
      return checked;
    default:
      return value;
  }
};

const FormField = ({ field, handleChange }) => {
  const { type, options, name, placeholder, required, fields } = field;

  const commonProps = useMemo(
    () => ({
      id: name,
      name,
      placeholder,
      required,
      className: FIELD_CLASSES,
    }),
    [name, placeholder, required]
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
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case 'nested':
      // TODO: implement the logic to render the nested fields
      return;
    default:
      return null;
  }
};

export default FormField;
