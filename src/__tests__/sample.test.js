import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicForm from '../components/DynamicForm';

test('form should render required fields correctly', () => {
  const formSchema = [
    { type: 'text', name: 'email', label: 'Email', required: true },
  ];
  render(<DynamicForm formSchema={formSchema} />);

  const emailInput = screen.getByLabelText(/email/i);
  expect(emailInput).toBeRequired();
});

test('form should render disabled fields correctly', () => {
  const formSchema = [
    { type: 'text', name: 'username', label: 'Username', disabled: true },
  ];
  render(<DynamicForm formSchema={formSchema} />);

  const usernameInput = screen.getByLabelText(/username/i);
  expect(usernameInput).toBeDisabled();
});

test('dropdown should have correct values and display corresponding labels', () => {
  const formSchema = [
    {
      type: 'select',
      name: 'country',
      label: 'Country',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
      ],
    },
  ];

  render(<DynamicForm formSchema={formSchema} />);

  expect(screen.getByRole('option', { name: 'United States' }).value).toBe(
    'us'
  );
  expect(screen.getByRole('option', { name: 'Canada' }).value).toBe('ca');
});
