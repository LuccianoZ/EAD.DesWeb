import TaskItem from './TaskItem';
import './TaskList.css';

export default function TaskList({ tasks, onToggle, onUpdate, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map((task, i) => (
        <TaskItem
          key={task.id}
          task={task}
          index={i}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
