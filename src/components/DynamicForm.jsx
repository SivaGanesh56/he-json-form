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
  // TODO: implement the validation logic using formSchema.validate
  return true;
};

const DynamicForm = ({ formSchema, onFormDataChange }) => {
  const [formData, setFormData] = useState({});
  const [formStatus, setFormStatus] = useState(undefined);

  const handleChange = useCallback(
    ({ name, value }) => {
      const newFormData = mergeDeep(
        { ...formData },
        {
          [name]: value,
        }
      );

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
        <div className="text-[#824463] text-lg mb-2.5">
          {formStatus
            ? 'Form Submitted Successfully'
            : 'Form Validation Failed'}
        </div>
      ) : null}
      <form
        className="flex flex-col gap-4 border p-4 rounded-md border-solid border-[#ccc]"
        role="form"
        onSubmit={handleSubmit}
      >
        <SchemaField formSchema={formSchema} handleChange={handleChange} />
        <button
          className="text-white bg-[#007bff] inline-block font-normal text-center whitespace-nowrap align-middle select-none border text-base leading-normal rounded px-3 py-1.5 border-[#007bff] border-solid border-transparent"
          type="submit"
        >
          Submit
        </button>
      </form>
    </Fragment>
  );
};

export default DynamicForm;
