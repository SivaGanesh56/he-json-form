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

test('handles deeply nested field structures correctly', () => {
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
          type: 'nested',
          label: 'Location Details',
          name: 'locationDetails',
          fields: [
            {
              type: 'text',
              name: 'city',
              label: 'City',
            },
            {
              type: 'nested',
              label: 'Country Details',
              name: 'countryDetails',
              fields: [
                {
                  type: 'text',
                  name: 'country',
                  label: 'Country',
                },
                {
                  type: 'text',
                  name: 'state',
                  label: 'State',
                },
              ],
            },
          ],
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
  const cityInput = screen.getByLabelText(/city/i);
  const countryInput = screen.getByLabelText(/country/i);
  const stateInput = screen.getByLabelText(/state/i);

  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  fireEvent.click(checkboxInput);
  fireEvent.change(areaInput, { target: { value: 'Springfield' } });
  fireEvent.change(zipcodeInput, { target: { value: 23513 } });
  fireEvent.change(cityInput, { target: { value: 'Gotham' } });
  fireEvent.change(countryInput, { target: { value: 'USA' } });
  fireEvent.change(stateInput, { target: { value: 'NY' } });

  const expectedFormData = {
    name: 'John Doe',
    subscribe: true,
    address: {
      area: 'Springfield',
      zipcode: 23513,
      locationDetails: {
        city: 'Gotham',
        countryDetails: {
          country: 'USA',
          state: 'NY',
        },
      },
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
    label: 'User Email',
    placeholder: 'Enter your email address',
    required: true,
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  },
  {
    type: 'select',
    name: 'region',
    label: 'Region',
    placeholder: 'Select your region',
    options: [
      { value: 'ny', label: 'New York' },
      { value: 'la', label: 'Los Angeles' },
    ],
  },
  {
    type: 'checkbox',
    name: 'newsletter',
    label: 'Sign up for newsletter',
  },
  {
    type: 'nested',
    label: 'Residence',
    name: 'residence',
    fields: [
      {
        type: 'text',
        name: 'neighborhood',
        label: 'Neighborhood',
      },
      {
        type: 'number',
        name: 'postalCode',
        label: 'Postal Code',
      },
      {
        type: 'text',
        name: 'primaryContact',
        label: 'Primary Number',
        validate: (value) => String(value).startsWith('+91'),
      },
      {
        type: 'nested',
        name: 'currentAddress',
        label: 'Current Address',
        fields: [
          {
            type: 'text',
            name: 'phoneNumber',
            label: 'Phone Number',
            placeholder: 'Enter your phone number',
            validate: (value) => String(value).startsWith('+1'),
          },
        ],
      },
    ],
  },
];

// Test case for flat data
test('form should validate and submit correctly with flat data', async () => {
  render(<DynamicForm formSchema={formSchema} />);

  // Fill in the form with valid data
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText(/user email/i), {
    target: { value: 'john.doe' }, // invalid
  });
  fireEvent.change(screen.getByLabelText(/region/i), {
    target: { value: 'la' },
  });
  fireEvent.click(screen.getByLabelText(/sign up for newsletter/i));
  fireEvent.change(screen.getByLabelText(/neighborhood/i), {
    target: { value: 'Downtown' },
  });
  fireEvent.change(screen.getByLabelText(/postal code/i), {
    target: { value: 90001 },
  });
  fireEvent.change(
    screen.getByLabelText(/primary number/i, { selector: 'input' }),
    {
      target: { value: '+9134567890' },
    }
  );
  fireEvent.change(
    screen.getByLabelText(/phone number/i, { selector: 'input' }),
    {
      target: { value: '+1234567890' },
    }
  );

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for the failure message to appear
  await waitFor(
    () => {
      const failureMessage = screen.getByText(/form validation failed/i);
      expect(failureMessage).toBeInTheDocument();
    },
    { timeout: 3000 }
  );

  fireEvent.change(screen.getByLabelText(/user email/i), {
    target: { value: 'john.doe@gmail.com' }, // valid
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

// Test case for nested data
test('form should validate and submit correctly with nested data', async () => {
  render(<DynamicForm formSchema={formSchema} />);

  // Fill in the form with invalid data
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText(/user email/i), {
    target: { value: 'john.doe@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/region/i), {
    target: { value: 'la' },
  });
  fireEvent.click(screen.getByLabelText(/sign up for newsletter/i));

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for the failure message to appear
  await waitFor(
    () => {
      const failureMessage = screen.getByText(/form validation failed/i);
      expect(failureMessage).toBeInTheDocument();
    },
    { timeout: 3000 }
  );

  // nested fields
  fireEvent.change(screen.getByLabelText(/neighborhood/i), {
    target: { value: 'Downtown' },
  });
  fireEvent.change(screen.getByLabelText(/postal code/i), {
    target: { value: 90001 },
  });
  fireEvent.change(
    screen.getByLabelText(/primary number/i, { selector: 'input' }),
    {
      target: { value: '+34567890' }, // invalid
    }
  );
  fireEvent.change(
    screen.getByLabelText(/phone number/i, { selector: 'input' }),
    {
      target: { value: '34567890' }, // invalid
    }
  );

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for the failure message to appear
  await waitFor(
    () => {
      const failureMessage = screen.getByText(/form validation failed/i);
      expect(failureMessage).toBeInTheDocument();
    },
    { timeout: 3000 }
  );

  fireEvent.change(
    screen.getByLabelText(/primary number/i, { selector: 'input' }),
    {
      target: { value: '+914567890' }, // valid
    }
  );
  fireEvent.change(
    screen.getByLabelText(/phone number/i, { selector: 'input' }),
    {
      target: { value: '+134567890' }, // valid
    }
  );

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
