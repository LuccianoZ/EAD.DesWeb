import { useState } from 'react';
import './TaskItem.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TaskItem({ task, index, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);
    await onUpdate(task.id, editTitle.trim(), editDesc.trim());
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task.id);
  };

  return (
    <li
      className={`task-item ${task.completed ? 'completed' : ''} ${deleting ? 'deleting' : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {editing ? (
        <div className="task-edit">
          <input
            className="edit-input"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="edit-textarea"
            value={editDesc}
            onChange={e => setEditDesc(e.target.value)}
            placeholder="Description (optional)..."
            rows={2}
          />
          <div className="edit-actions">
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={!editTitle.trim() || saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="task-view">
          <button
            className={`task-check ${task.completed ? 'checked' : ''}`}
            onClick={() => onToggle(task.id)}
            title={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed && (
              <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          <div className="task-content">
            <span className="task-title">{task.title}</span>
            {task.description && <p className="task-desc">{task.description}</p>}
            <span className="task-date">
              {task.updated_at !== task.created_at
                ? `Edited ${formatDate(task.updated_at)}`
                : `Added ${formatDate(task.created_at)}`}
            </span>
          </div>

          <div className="task-actions">
            {task.completed && (
              <span className="badge-done">Done</span>
            )}
            <button className="icon-btn edit-btn" onClick={() => setEditing(true)} title="Edit">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L4.833 13.833 2 14.5l.667-2.833L11.333 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="icon-btn delete-btn" onClick={handleDelete} title="Delete" disabled={deleting}>
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4h12M5.333 4V2.667h5.334V4M6.667 7.333v4M9.333 7.333v4M3.333 4l.667 9.333h8L12.667 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
