<<<<<<< HEAD
"use client";

import { useState } from "react";
=======
'use client';

import { useState } from 'react';
>>>>>>> ed34824 (Implement todo app with backend API)

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
<<<<<<< HEAD
  const [text, setText] = useState("");
=======
  const [text, setText] = useState('');
>>>>>>> ed34824 (Implement todo app with backend API)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
<<<<<<< HEAD
      setText("");
=======
      setText('');
>>>>>>> ed34824 (Implement todo app with backend API)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
    </form>
  );
}
