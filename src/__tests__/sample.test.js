import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicForm from '../components/DynamicForm';

test('handles nested field structures correctly', () => {
  const formSchema = [
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      placeholder: 'Enter your name',
    },
    {
      type: 'checkbox',
      name: 'subscribe',
      label: 'Subscribe to newsletter',
    },
    { type: 'number', name: 'age', label: 'Age' },
    {
      type: 'nested',
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

  let formData = {};

  render(
    <DynamicForm
      formSchema={formSchema}
      onFormDataChange={(data) => {
        formData = data;
      }}
    />
  );

  const nameInput = screen.getByLabelText(/name/i);
  const checkboxInput = screen.getByLabelText(/subscribe to newsletter/i);
  const areaInput = screen.getByLabelText(/area/i);
  const zipcodeInput = screen.getByLabelText(/zipcode/i);

  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  fireEvent.click(checkboxInput);
  fireEvent.change(areaInput, { target: { value: 'Springfield' } });
  fireEvent.change(zipcodeInput, { target: { value: 23513 } });

  const expectedFormData = {
    name: 'John Doe',
    subscribe: true,
    address: {
      area: 'Springfield',
      zipcode: 23513,
    },
  };

  expect(formData).toEqual(expectedFormData);
});

// Define the form schema
const formSchema = [
  {
    type: 'text',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your Email',
    required: true,
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
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
    type: 'nested',
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
      {
        type: 'text',
        name: 'contact',
        label: 'Contact',
        validate: (value) => String(value).startsWith('+91'),
      },
    ],
  },
];

test('form should validate and submit correctly with flat data', async () => {
  render(<DynamicForm formSchema={formSchema} />);

  // Fill in the form with valid data
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'Alice Johnson' },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'alice.johnson' },
  });
  fireEvent.change(screen.getByLabelText(/country/i), {
    target: { value: 'ca' },
  });
  fireEvent.click(screen.getByLabelText(/subscribe to newsletter/i));
  fireEvent.change(screen.getByLabelText(/area/i), {
    target: { value: 'Gotham' },
  });
  fireEvent.change(screen.getByLabelText(/zipcode/i), {
    target: { value: 54321 },
  });
  fireEvent.change(screen.getByLabelText(/contact/i, { selector: 'input' }), {
    target: { value: '+919876543210' },
  });

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for the failure message to appear
  await waitFor(
    () => {
      const successMessage = screen.getByText(/form validation failed/i);
      expect(successMessage).toBeInTheDocument();
    },
    { timeout: 3000 }
  );

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'alice.johnson@gmail.com' },
  });

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for the success message to appear
  await waitFor(
    () => {
      const successMessage = screen.getByText(/form submitted successfully/i);
      expect(successMessage).toBeInTheDocument();
    },
    { timeout: 3000 }
  );
});

test('form should validate and submit correctly with nested data', async () => {
  render(<DynamicForm formSchema={formSchema} />);

  // Fill in the form with invalid data
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'Alice Johnson' },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'alice.johnson@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/country/i), {
    target: { value: 'ca' },
  });
  fireEvent.click(screen.getByLabelText(/subscribe to newsletter/i));
  fireEvent.change(screen.getByLabelText(/area/i), {
    target: { value: 'Gotham' },
  });
  fireEvent.change(screen.getByLabelText(/zipcode/i), {
    target: { value: 54321 },
  });
  fireEvent.change(screen.getByLabelText(/contact/i, { selector: 'input' }), {
    target: { value: '9876543210' }, // Invalid contact
  });

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for the failure message to appear with a custom timeout
  await waitFor(
    () => {
      const failureMessage = screen.queryByText(/form validation failed/i);
      // Check that the failure message is not in the document
      expect(failureMessage).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );

  fireEvent.change(screen.getByLabelText(/contact/i, { selector: 'input' }), {
    target: { value: '+919876543210' }, // valid contact
  });

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for the success message to appear with a custom timeout
  await waitFor(
    () => {
      const failureMessage = screen.queryByText(/form submitted successfully/i);
      // Check that the failure message is not in the document
      expect(failureMessage).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );
});
