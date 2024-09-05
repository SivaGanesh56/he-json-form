import React, { Fragment, useCallback, useState } from 'react';
import SchemaField from './SchemaField';
import { mergeDeep } from '../utils/mergeDeep';

/**
 * Validate the entire form recursively
 * @param {Object} formSchema
 * @param {Object} formData
 * @returns {Boolean}
 */
const validateForm = (formSchema, formData) => {
  // TODO: implement
  return true;
};

const DynamicForm = ({ formSchema, onFormDataChange }) => {
  const [formData, setFormData] = useState({});
  const [formStatus, setFormStatus] = useState(undefined);

  const handleChange = useCallback(
    ({ name, value }) => {
      const newFormData = mergeDeep(formData, {
        [name]: value,
      });

      setFormData(newFormData);
      setFormStatus(undefined);

      onFormDataChange && onFormDataChange(newFormData);
    },
    [formData]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setFormStatus(validateForm(formSchema, formData));
    },
    [formSchema, formData]
  );

  return (
    <Fragment>
      {formStatus !== undefined ? (
        <div className="form-status">
          {formStatus
            ? 'Form Submitted Successfully'
            : 'Form Validation Failed'}
        </div>
      ) : null}
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
