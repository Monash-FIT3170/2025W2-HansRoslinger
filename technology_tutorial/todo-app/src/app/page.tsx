'use client';


import { useState } from 'react';
import TodoList from '@/components/TodoList';
import AddTodo from '@/components/AddTodo';


export default function Home() {
 const [todos, setTodos] = useState<string[]>([]);


 const addTodo = (text: string) => {
   setTodos([...todos, text]);
 };


 const deleteTodo = (index: number) => {
   setTodos(todos.filter((_, i) => i !== index));
 };


 return (
   <main className="min-h-screen p-8">
     <div className="max-w-md mx-auto">
       <h1 className="text-3xl font-bold mb-8 text-center">Todo App</h1>
       <AddTodo onAdd={addTodo} />
       <TodoList todos={todos} onDelete={deleteTodo} />
     </div>
   </main>
 );
}
