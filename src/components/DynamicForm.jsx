import React, { Fragment, useCallback, useState } from 'react';
import SchemaField from './SchemaField';
import { mergeDeep } from '../utils/mergeDeep';

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

  const handleSubmit = useCallback((e) => {
    /**
       if {true}  setFormStatus('Form Submitted Successfully!');
       if {false} setFormStatus('Form Validation Failed');
       */
  }, []);

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
