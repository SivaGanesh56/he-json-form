import React, { Fragment, useCallback, useState } from 'react';
import SchemaField from './SchemaField';
import { mergeDeep } from '../utils/mergeDeep';

// Validate the entire form recursively
const validateForm = (formSchema, formData) => {
  // TODO: implement
};

const DynamicForm = ({ formSchema, onFormDataChange }) => {
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

      let formStatus = validateForm(formSchema, formData);
      if (formStatus)
        setFormStatus(
          formStatus ? 'Form Submitted Successfully!' : 'Form Validation Failed'
        );
    },
    [formSchema, formData]
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
