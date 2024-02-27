
import React, { useState } from 'react';
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit,FaSave } from "react-icons/fa";

function TodoItem({ todo, completed, onDelete, onEdit, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo);

  const handleUpdateSubmit = () => {
    onEdit(editValue);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-left p-2 mt-2 bg-white shadow rounded-md">
      <input type="checkbox" checked={completed} onChange={onToggleComplete} className="mr-4 h-5 w-5 text-blue-500 rounded" />
      {isEditing ? (
        <input className="border-2 border-gray-300 p-2 rounded-md" type ='text' value={editValue} onChange={(e) => setEditValue(e.target.value)} required />
      ) : (
        <span className={`text-lg mr-2 ${completed ? 'line-through' : ''}`}>{todo}</span>
      )}
      {isEditing ? (
        <button className="bg-black text-white px-4 py-2 m-2 rounded-md mr-2" onClick={handleUpdateSubmit}><FaSave /></button>
      ) : (
        <button className="bg-black text-white px-4 py-2 rounded-md mr-2" onClick={() => setIsEditing(true)}><FaEdit /></button>
      )}
      <button className="bg-black text-white px-4 py-2 rounded-md" onClick={onDelete}><FaTrashAlt />
</button>
    </div>
  );
}

export default TodoItem;