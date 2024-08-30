import React, { useCallback } from 'react';
import DynamicForm from './components/DynamicForm';
import './styles.css';

const formSchema = [
  {
    type: 'text',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
  },
  {
    type: 'select',
    name: 'country',
    label: 'Country',
    placeholder: 'please select',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
    ],
  },
  {
    type: 'checkbox',
    name: 'subscribe',
    label: 'Subscribe to newsletter',
  },
  { type: 'number', name: 'contact', label: 'Contact' },
  {
    type: 'radio',
    name: 'gender',
    label: 'Gender',
    disabled: true,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
  },
  {
    // For Nested Fields
    type: 'object',
    label: 'Address',
    name: 'address',
    fields: [
      {
        type: 'text',
        name: 'area',
        label: 'Area',
      },
      {
        type: 'number',
        name: 'zipcode',
        label: 'Zipcode',
      },
    ],
  },
];

export default function App() {
  /**
   * Custom validation function to check form data.
   * @param {object} formData - The current form data.
   * @returns {boolean} - Returns true if validation passes, false otherwise.
   */
  const customValidate = useCallback((formData) => {
    // TODO: implement validation logic
    // Example: return true if a specific field starts with a certain value
  }, []);

  return (
    <div className="root-container">
      <h1 className="form-heading">Dynamic Form</h1>
      <DynamicForm formSchema={formSchema} customValidate={customValidate} />
    </div>
  );
}
