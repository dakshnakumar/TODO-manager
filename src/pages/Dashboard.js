import { gql, useMutation, useSubscription, useQuery } from '@apollo/client';
import { useOutletContext } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import TodoItem from './TodoItem';
import myIcon from './download.jpeg';

const GET_TODOS = gql`
  subscription {
    todos {
      id
      created_at
      name
      completed
    }
  }
`;
const INSERT_TODO = gql`
  mutation($todo: todos_insert_input!) {
    insert_todos(objects: [$todo]) {
      affected_rows
    }
  }
`;
const UPDATE_TODO = gql`
  mutation($id: uuid!, $name: String!) {
    update_todos(where: { id: { _eq: $id } }, _set: { name: $name }) {
      affected_rows
    }
  }
`;
const MARK_AS_COMPLETED = gql`
  mutation($id: uuid!, $completed: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { completed: $completed }) {
      affected_rows
    }
  }
`;
const DELETE_TODO = gql`
  mutation($id: uuid!) {
    delete_todos(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

const Dashboard = () => {
  const [todoName, setTodoName] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState(null); 
  const { data, loading, error } = useSubscription(GET_TODOS);
  const [insertTodo] = useMutation(INSERT_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [markAsCompleted] = useMutation(MARK_AS_COMPLETED);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [input, setInput] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await insertTodo({
        variables: {
          todo: {
            name: todoName,
          },
        },
      });
      setTodoName(''); // Clear input after successful insertion
    } catch (error) {
      console.error(error);
      alert('Error inserting todo!', error.message);
    }
  };

  const handleUpdateTodo = async (todoId) => {
    setSelectedTodoId(todoId); // Set selected ID for potential update
    
  };

  const handleUpdateSubmit = async (selectedTodoId, todoName) => {
    if (!selectedTodoId) {
      alert('Please select a todo to update.');
      return;
    }

    try {
      await updateTodo({
        variables: {
          id: selectedTodoId,
          name: todoName, // Use the current todoName state
        },
      });

      setSelectedTodoId(null); // Clear selected ID after successful update
      setTodoName(''); // Clear input after successful update
    } catch (error) {
      console.error(error);
      alert('Error updating todo!', error.message);
    }
  };

  const handleMarkCompleted = async (todoId) => {
    try {
      await markAsCompleted({
        variables: {
          id: todoId,
          completed: !data.todos.find((todo) => todo.id === todoId).completed, // Toggle completed state
        },
      });
    } catch (error) {
      console.error(error);
      alert('Error marking todo as completed!', error.message);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return; // Prevent accidental deletion without confirmation
    }

    try {
      await deleteTodo({ variables: { id: todoId } });
    } catch (error) {
      console.error(error);
      alert('Error deleting todo!', error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;





  return (
    
    <div className="flex flex-col items-center justify-center pt-10">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
      <img src={myIcon} alt="My Icon" className="inline-block w-12 h-12 mr-2 rounded-full" />
        Block Survey Hackathon</h1>
      <h4 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
      My Todo App</h4>

      <form onSubmit={handleFormSubmit} >
             <input className="border-2 border-gray-300 p-2 rounded-md" type = 'text' value={todoName} onChange={(e)=> setTodoName(e.target.value)} required></input>
             <button className="bg-white text-black px-4 py-2 rounded-md mt-2" >Add</button>
        </form>
      {data.todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo.name}
          completed={todo.completed}
          onDelete={() => handleDeleteTodo(todo.id)}
          onEdit={(value) => handleUpdateSubmit(todo.id,value)}
          onToggleComplete={() => handleMarkCompleted(todo.id)}
        />
      ))}
    </div>


  );
};



export default Dashboard;