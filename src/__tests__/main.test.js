import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicForm from '../components/DynamicForm';

// test('dropdown should display correct labels', () => {
//   const formSchema = [
//     {
//       type: 'select',
//       name: 'country',
//       label: 'Country',
//       options: [
//         { value: 'us', label: 'United States' },
//         { value: 'ca', label: 'Canada' },
//         { value: 'mx', label: 'Mexico' },
//         { value: 'gb', label: 'United Kingdom' },
//         { value: 'au', label: 'Australia' },
//       ],
//     },
//   ];

//   render(<DynamicForm formSchema={formSchema} />);

//   expect(
//     screen.getByRole('option', { name: 'United States' })
//   ).toHaveTextContent('United States');
//   expect(screen.getByRole('option', { name: 'Canada' })).toHaveTextContent(
//     'Canada'
//   );
//   expect(screen.getByRole('option', { name: 'Mexico' })).toHaveTextContent(
//     'Mexico'
//   );
//   expect(
//     screen.getByRole('option', { name: 'United Kingdom' })
//   ).toHaveTextContent('United Kingdom');
//   expect(screen.getByRole('option', { name: 'Australia' })).toHaveTextContent(
//     'Australia'
//   );
// });

test('handles nested field structures correctly', () => {
  const formConfig = [
    {
      type: 'text',
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter your full name',
    },
    {
      type: 'checkbox',
      name: 'newsletterSubscription',
      label: 'Subscribe to newsletter updates',
    },
    { type: 'number', name: 'userAge', label: 'Your Age' },
    {
      type: 'nested',
      label: 'Contact Information',
      name: 'userAddress',
      fields: [
        {
          type: 'text',
          name: 'city',
          label: 'City',
        },
        {
          type: 'number',
          name: 'postalCode',
          label: 'Postal Code',
        },
      ],
    },
  ];

  let formData = {};

  render(
    <DynamicForm
      formSchema={formConfig}
      onFormDataChange={(data) => {
        formData = data;
      }}
    />
  );

  const nameInput = screen.getByLabelText(/full name/i);
  const checkboxInput = screen.getByLabelText(
    /subscribe to newsletter updates/i
  );
  const cityInput = screen.getByLabelText(/city/i);
  const postalCodeInput = screen.getByLabelText(/postal code/i);

  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  fireEvent.click(checkboxInput);
  fireEvent.change(cityInput, { target: { value: 'Springfield' } });
  fireEvent.change(postalCodeInput, { target: { value: 23513 } });

  const expectedFormData = {
    fullName: 'John Doe',
    newsletterSubscription: true,
    userAddress: {
      city: 'Springfield',
      postalCode: 23513,
    },
  };

  expect(formData).toEqual(expectedFormData);
});

const formSchema = [
  {
    type: 'text',
    name: 'fullName',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    type: 'text',
    name: 'userEmail',
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true,
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  },
  {
    type: 'select',
    name: 'userCountry',
    label: 'Country of Residence',
    placeholder: 'Please choose a country',
    options: [
      { value: 'us', label: 'USA' },
      { value: 'ca', label: 'Canada' },
    ],
  },
  {
    type: 'nested',
    label: 'Contact Info',
    name: 'userAddress',
    fields: [
      {
        type: 'text',
        name: 'region',
        label: 'Region',
      },
      {
        type: 'number',
        name: 'postalCode',
        label: 'Postal Code',
      },
      {
        type: 'text',
        name: 'phoneNumber',
        label: 'Phone Number',
        validate: (value) => String(value).startsWith('+44'),
      },
    ],
  },
];

test('form should validate and submit correctly with flat data', async () => {
  render(<DynamicForm formSchema={formSchema} />);

  // Fill in the form with valid data
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: 'Alice Johnson' },
  });
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: 'alice.johnson' },
  });
  fireEvent.change(screen.getByLabelText(/country of residence/i), {
    target: { value: 'ca' },
  });
  fireEvent.change(screen.getByLabelText(/region/i), {
    target: { value: 'Gotham' },
  });
  fireEvent.change(screen.getByLabelText(/postal code/i), {
    target: { value: 54321 },
  });
  fireEvent.change(
    screen.getByLabelText(/phone number/i, { selector: 'input' }),
    {
      target: { value: '+447987654321' },
    }
  );

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

  fireEvent.change(screen.getByLabelText(/email address/i), {
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
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: 'Alice Johnson' },
  });
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: 'alice.johnson@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/country of residence/i), {
    target: { value: 'ca' },
  });

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for the failure message to appear with a custom timeout
  await waitFor(
    () => {
      const failureMessage = screen.queryByText(/form validation failed/i);
      expect(failureMessage).toBeInTheDocument();
    },
    { timeout: 3000 }
  );

  // nested fields
  fireEvent.change(screen.getByLabelText(/region/i), {
    target: { value: 'Gotham' },
  });
  fireEvent.change(screen.getByLabelText(/postal code/i), {
    target: { value: 54321 },
  });
  fireEvent.change(
    screen.getByLabelText(/phone number/i, { selector: 'input' }),
    {
      target: { value: '1234567890' }, // Invalid phone number
    }
  );

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for the failure message to appear with a custom timeout
  await waitFor(
    () => {
      const failureMessage = screen.queryByText(/form validation failed/i);
      expect(failureMessage).toBeInTheDocument();
    },
    { timeout: 3000 }
  );

  fireEvent.change(
    screen.getByLabelText(/phone number/i, { selector: 'input' }),
    {
      target: { value: '+447987654321' }, // Valid phone number
    }
  );

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for the success message to appear with a custom timeout
  await waitFor(
    () => {
      const successMessage = screen.queryByText(/form submitted successfully/i);
      expect(successMessage).toBeInTheDocument();
    },
    { timeout: 3000 }
  );
});
