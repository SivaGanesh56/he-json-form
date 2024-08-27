import React, { Fragment, useCallback, useState } from 'react';
import SchemaField from './SchemaField';

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

const DynamicForm = ({ formSchema, onFormDataChange, customValidate }) => {
  const [formData, setFormData] = useState({});
  const [formStatus, setFormStatus] = useState('');

  const handleChange = useCallback(
    ({ name, value }) => {
      const newFormData = mergeDeep(formData, {
        [name]: value,
      });

      setFormData(newFormData);

      onFormDataChange && onFormDataChange(newFormData);
    },
    [formData]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      let isValidated = true;

      if (customValidate) {
        isValidated = customValidate(formData);
      }

      if (isValidated) {
        setFormData({});
        setFormStatus('Form Submitted Successfully!');
      } else {
        setFormStatus('Form Validation Failed');
      }

      setTimeout(() => {
        setFormStatus('');
      }, [5000]);
    },
    [formData, formSchema]
  );

  return (
    <Fragment>
      <div className={`form-status ${formStatus ? 'block' : 'hidden'}`}>
        {formStatus}
      </div>
      <form className="form-container" role="form" onSubmit={handleSubmit}>
        <SchemaField formSchema={formSchema} handleChange={handleChange} />
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>
    </Fragment>
  );
};

export default DynamicForm;
