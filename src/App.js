import React from 'react';
import DynamicForm from './components/DynamicForm';
import './styles.css';
import { formSchema } from './schema';

export default function App() {
  return (
    <div className="root-container">
      <h1 className="form-heading">Dynamic Form</h1>
      <DynamicForm formSchema={formSchema} />
    </div>
  );
}
