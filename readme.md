# Dynamic Form

## Overview

You are provided with a **Dynamic Form** that can render various types of form fields (text, select, checkbox, number, radio) based on a given schema. The form supports features like custom validation, nested fields, and handles form data changes through callbacks.

### Your Task

Most of the code is already implemented. Your task is to:

1. **Implement Missing Features:** Add any necessary features that are currently missing.
2. **Fix Broken Functionality:** Identify and correct any bugs in the existing code.
3. **Ensure Accessibility:** Make sure the form is accessible and follows best practices.

### Example Schema and Usage:

```javascript
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
```

![Form](./image.png)

### Test Cases

- **Form Renders Required Fields Correctly:**

  - Ensure that fields marked as required in the schema are correctly rendered with the `required` attribute. Currently, required field validation is not functioning properly, so this needs to be fixed. The `required` attribute will be passed as part of the schema like this:

  ```javascript
  {
    type: 'text',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
  }
  ```

- **Form Renders Disabled Fields Correctly:**

  - Ensure that fields marked as `disabled` in the schema are correctly rendered with the `disabled` attribute. Currently, disabled field rendering is not functioning properly, so this needs to be fixed. The `disabled` attribute will be passed as part of the schema like this:

  ```javascript
  {
    type: 'text',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    disabled: true,
  }
  ```

- **Dropdown Has Correct Values and Displays Corresponding Labels:**

  - Verify that `select` fields render the correct options and display the appropriate labels. Currently, the dropdown is choosing the label instead of the value, so this needs to be fixed. The `select` field schema example is provided below:

  ```javascript
  {
    type: 'select',
    name: 'country',
    label: 'Country',
    placeholder: 'please select',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
    ],
  }
  ```

- **Checkbox Stores Boolean Value:**

  - Test that the checkbox field correctly updates the form data with a boolean value based on the user's interaction. The `checkbox` field schema example is provided below:

  ```javascript
  {
    type: 'checkbox',
    name: 'subscribe',
    label: 'Subscribe to newsletter',
  }
  ```

- **Form Data Has Correct Structure and Data Types:**

  - Ensure that the form data structure matches the schema definition and that data types are correctly parsed and stored. For example, if the form schema includes fields for `username` (text), `age` (number), and `acceptTerms` (checkbox), make sure that:

    - `username` is stored as a string,
    - `age` is stored as a number,
    - `acceptTerms` is stored as a boolean.

  - Verify that after filling out the form and submitting it, the form data adheres to the correct structure and data types as specified in the schema.

- **Implement Radio Button:**

  - Ensure that radio button fields are correctly implemented, allowing users to select one option from a list of values. The options should be passed as part of the schema like this:

  ```javascript
  {
    type: 'radio',
    name: 'gender',
    label: 'Gender',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
  }
  ```

  - Verify that the selected value is correctly stored in the form data.

- **Handles Nested Field Structures Correctly:**

  - Ensure that nested fields are managed properly and that their data is correctly nested within the form data object. The schema might include a structure like this:

  ```javascript
  const formSchema = [
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      placeholder: 'Enter your name',
      required: true,
    },
    {
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
  ```

  - Verify that the nested structure in the form data matches the expected format. For example:

  ```javascript
  const expectedFormData = {
    name: 'John Doe',
    address: {
      area: 'Springfield',
      zipcode: 23513,
    },
  };
  ```

- **Form Submits Successfully When Custom Validation Passes:**

  - Ensure that the form submits successfully when the custom validation function returns `true`. The `customValidate` function should be implemented to validate the form data according to specific criteria.

  ```javascript
  <DynamicForm formSchema={formSchema} customValidate={customValidate} />
  ```

  The `customValidate` function could look something like this:

  ```javascript
  /**
   * Custom validation function to check form data.
   * @param {object} formData - The current form data.
   * @returns {boolean} - Returns true if validation passes, false otherwise.
   */
  const customValidate = useCallback((formData) => {
    // TODO: implement validation logic
    // Example: return true if a specific field starts with a certain value
  }, []);
  ```

- **Form Shows Validation Error When Custom Validation Fails:**

  - Ensure that the form displays an appropriate error message when the custom validation function fails. The candidate should implement the logic for handling failed validation and update the form status to show the error message.

  The `customValidate` function will be provided with the form data and should return `false` if the validation fails. If the validation fails, the form should display an error message, such as "Form Validation Failed."
