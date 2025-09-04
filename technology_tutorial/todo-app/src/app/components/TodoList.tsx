"use client";

interface TodoListProps {
  todos: string[];
  onDelete: (index: number) => void;
}

export default function TodoList({ todos, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No todos yet. Add one above!
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo, index) => (
        <li
          key={index}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
          <span className="flex-1">{todo}</span>
          <button
            onClick={() => onDelete(index)}
            className="ml-4 px-3 py-1 text-sm text-red-500 hover:text-red-700 focus:outline-none"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
