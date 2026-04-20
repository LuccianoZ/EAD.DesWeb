import { useState } from 'react';
import './TaskForm.css';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDesc, setShowDesc] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await onAdd(title.trim(), description.trim());
    setTitle('');
    setDescription('');
    setShowDesc(false);
    setSubmitting(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <span className="form-label">NEW TASK</span>
      </div>
      <div className="form-body">
        <input
          className="form-input"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={255}
        />
        {showDesc && (
          <textarea
            className="form-textarea"
            placeholder="Add a description (optional)..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        )}
        <div className="form-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowDesc(v => !v)}
          >
            {showDesc ? '− Hide description' : '+ Add description'}
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!title.trim() || submitting}
          >
            {submitting ? 'Adding…' : 'Add Task'}
          </button>
        </div>
      </div>
    </form>
  );
}
