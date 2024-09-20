import React from 'react';
import DynamicForm from './components/DynamicForm';
import { formSchema } from './schema';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center my-5">
      <h1 className="text-[22px] font-semibold mb-2.5">Dynamic Form</h1>
      <DynamicForm formSchema={formSchema} />
    </div>
  );
}
