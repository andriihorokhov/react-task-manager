import { useState } from 'react';
function TaskItem({ task, deleteTask, toggleComplete, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  return (
    <li>
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
      ) : (
        task.title
      )}
      <button
        onClick={() => {
          if (isEditing) {
            setEditedTitle(task.title);
          }
          setIsEditing(!isEditing);
        }}
      >
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
      {isEditing && (
        <button
          onClick={() => {
            if (editedTitle.trim()) {
              editTask(task.id, editedTitle.trim());
            } else {
              return;
            }
            setIsEditing(!isEditing);
          }}
        >
          Save
        </button>
      )}
      <button onClick={() => deleteTask(task.id)}>Delete</button>
      <button onClick={() => toggleComplete(task.id)}>
        {task.completed ? 'Incomplete' : 'Complete'}
      </button>
    </li>
  );
}

export default TaskItem;
