'use client';

import { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

export default function Home() {
  const [todos, setTodos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    setLoading(true);
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data.todos || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (text: string) => {
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    fetchTodos();
  };

  const deleteTodo = async (index: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index }),
    });
    fetchTodos();
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Todo App</h1>
        <AddTodo onAdd={addTodo} />
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <TodoList todos={todos} onDelete={deleteTodo} />
        )}
      </div>
    </main>
  );
}