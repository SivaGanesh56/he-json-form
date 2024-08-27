import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicForm from '../components/DynamicForm';

test('checkbox should store boolean value', () => {
  const formSchema = [
    { type: 'checkbox', name: 'acceptTerms', label: 'Accept Terms' },
  ];

  let formData;

  render(
    <DynamicForm
      formSchema={formSchema}
      onFormDataChange={(data) => {
        formData = data;
      }}
    />
  );

  const checkbox = screen.getByLabelText(/accept terms/i);

  fireEvent.click(checkbox);
  expect(formData.acceptTerms).toBe(true);

  fireEvent.click(checkbox);
  expect(formData.acceptTerms).toBe(false);
});

test('form data should have correct structure and data types', () => {
  const formSchema = [
    { type: 'text', name: 'username', label: 'Username' },
    { type: 'number', name: 'age', label: 'Age' },
    { type: 'checkbox', name: 'acceptTerms', label: 'Accept Terms' },
  ];

  let formData = {};
  const onFormDataChange = (data) => {
    formData = data;
  };

  render(
    <DynamicForm formSchema={formSchema} onFormDataChange={onFormDataChange} />
  );

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: 'JohnDoe' },
  });
  fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '30' } });
  fireEvent.click(screen.getByLabelText(/accept terms/i));

  fireEvent.submit(screen.getByRole('form'));

  expect(formData).toEqual({
    username: 'JohnDoe',
    age: 30,
    acceptTerms: true,
  });
});

test('implement radio button and allow one selection at a time', () => {
  const formSchema = [
    {
      type: 'radio',
      name: 'gender',
      label: 'Gender',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
    },
  ];
  render(<DynamicForm formSchema={formSchema} />);

  const maleRadio = screen.getByLabelText('Male');
  const femaleRadio = screen.getByLabelText('Female');

  fireEvent.click(maleRadio);
  expect(maleRadio.checked).toBe(true);
  expect(femaleRadio.checked).toBe(false);

  fireEvent.click(femaleRadio);
  expect(femaleRadio.checked).toBe(true);
  expect(maleRadio.checked).toBe(false);
});

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

test('form submits successfully when custom validation passes', async () => {
  const formSchema = [{ type: 'text', name: 'username', label: 'Username' }];

  const mockCustomValidate = jest.fn().mockReturnValue(true);

  render(
    <DynamicForm formSchema={formSchema} customValidate={mockCustomValidate} />
  );

  const input = screen.getByLabelText('Username');
  const submitButton = screen.getByRole('button', { name: /submit/i });

  // Fill out the form
  fireEvent.change(input, { target: { value: 'JohnDoe' } });

  // Submit the form
  fireEvent.click(submitButton);

  // Ensure customValidate was called with the formData
  expect(mockCustomValidate).toHaveBeenCalledWith({ username: 'JohnDoe' });

  // Wait for the form status to be updated
  await waitFor(() =>
    expect(screen.getByText('Form Submitted Successfully!')).toBeInTheDocument()
  );
});

test('form shows validation error when custom validation fails', async () => {
  const formSchema = [{ type: 'text', name: 'username', label: 'Username' }];

  const mockCustomValidate = jest.fn().mockReturnValue(false);

  render(
    <DynamicForm formSchema={formSchema} customValidate={mockCustomValidate} />
  );

  const input = screen.getByLabelText('Username');
  const submitButton = screen.getByRole('button', { name: /submit/i });

  // Fill out the form
  fireEvent.change(input, { target: { value: 'JohnDoe' } });

  // Submit the form
  fireEvent.click(submitButton);

  // Ensure customValidate was called with the formData
  expect(mockCustomValidate).toHaveBeenCalledWith({ username: 'JohnDoe' });

  // Wait for the form status to be updated
  await waitFor(() =>
    expect(screen.getByText('Form Validation Failed')).toBeInTheDocument()
  );
});
