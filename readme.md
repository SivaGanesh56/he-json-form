# Dynamic Form Component

## Overview

This project demonstrates how to build a dynamic form in React using a schema-driven approach. The form components render based on a configuration object (`formSchema`) that defines various input fields like text, select, checkbox, radio buttons, and nested fields.

## Features

- **Dynamic Form Fields**: Render form fields based on a schema configuration.
- **Custom Validation**: Implement custom validation logic for form submission.
- **Nested Field Support**: Supports complex nested field structures.
- **Data Binding**: Automatically updates form data as users interact with the form.
- **Status Messages**: Displays success or failure messages based on form submission.

## Example `formSchema`

Here’s an example of a `formSchema`:

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
  {
    type: 'radio',
    name: 'gender',
    label: 'Gender',
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

#### output

![Form](./image.png)

## Submission Instructions

1. Clicking "Run code" will compile and run your code against sample tests, but it will not generate scores. Click on "Execution Log" to better understand the test execution.
2. Clicking "Submit code" will run your code against multiple test cases, assessing different scenarios holistically. The score will be assigned accordingly.

To access the instructions, click on the "Question" button which can be found in the bottom left corner of the screen.

```

```
