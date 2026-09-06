import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../api/todos';
import { PRIORITIES, type Todo, type TodoPriority } from '../types';
import { useToast } from '../components/ToastContext';
import { useConfirm } from '../components/ConfirmContext';
import { dueBadge } from '../utils/due';

type Filter = 'all' | 'active' | 'done';
type SortBy = 'created' | 'due' | 'progress' | 'priority';

const PRIORITY_RANK: Record<TodoPriority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function DueBadge({ dueDate }: { dueDate: string | null }) {
  const badge = dueBadge(dueDate);
  return badge ? <span className={'due-badge ' + badge.cls}>{badge.text}</span> : null;
}

export default function TodosPage() {
  const toast = useToast();
  const { confirm } = useConfirm();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('created');
  const [loading, setLoading] = useState(true);

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<TodoPriority>('MEDIUM');
  const [editDue, setEditDue] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setTodos([]))
      .finally(() => setLoading(false));
  }, []);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const created = await createTodo({ title: title.trim(), priority, dueDate: dueDate || null });
      setTodos((prev) => [created, ...prev]);
      setTitle('');
      setPriority('MEDIUM');
      setDueDate('');
      toast.show('Task added');
    } catch {
      toast.show('Could not add task', 'error');
    }
  }

  async function onDelete(todo: Todo) {
    const ok = await confirm(`Delete "${todo.title}"?`);
    if (!ok) return;
    try {
      await deleteTodo(todo.id);
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
      toast.show('Task deleted');
    } catch {
      toast.show('Could not delete task', 'error');
    }
  }

  function onProgressDrag(id: number, value: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, progress: value, completed: value >= 100 } : t)),
    );
  }

  async function commitProgress(todo: Todo, value: number) {
    try {
      const updated = await updateTodo(todo.id, {
        title: todo.title,
        progress: value,
        priority: todo.priority,
        dueDate: todo.dueDate,
      });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      if (value >= 100) toast.show('Task completed 🎉');
    } catch {
      toast.show('Could not update progress', 'error');
    }
  }

  const STEP = 10;

  function stepProgress(todo: Todo, delta: number) {
    const value = Math.max(0, Math.min(100, todo.progress + delta));
    if (value === todo.progress) return;
    onProgressDrag(todo.id, value);
    commitProgress(todo, value);
  }

  function markComplete(todo: Todo) {
    if (todo.progress === 100) return;
    onProgressDrag(todo.id, 100);
    commitProgress(todo, 100);
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setEditDue(todo.dueDate ?? '');
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(todo: Todo) {
    if (!editTitle.trim()) return;
    try {
      const updated = await updateTodo(todo.id, {
        title: editTitle.trim(),
        progress: todo.progress,
        priority: editPriority,
        dueDate: editDue || null,
      });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      setEditingId(null);
      toast.show('Task updated');
    } catch {
      toast.show('Could not save task', 'error');
    }
  }

  const visible = useMemo(() => {
    let list = todos.filter((t) =>
      filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed,
    );
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((t) => t.title.toLowerCase().includes(q));

    const sorted = [...list];
    if (sortBy === 'due') {
      sorted.sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));
    } else if (sortBy === 'progress') {
      sorted.sort((a, b) => b.progress - a.progress);
    } else if (sortBy === 'priority') {
      sorted.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
    }
    return sorted;
  }, [todos, filter, search, sortBy]);

  return (
    <div className="page">
      <h1 className="page-title">Todos</h1>

      <form className="add-form" onSubmit={onAdd}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task…"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value as TodoPriority)}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>

      <input
        className="search-box"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search tasks…"
      />

      <div className="toolbar">
        <div className="filters">
          {(['all', 'active', 'done'] as Filter[]).map((f) => (
            <button
              key={f}
              className={'chip' + (filter === f ? ' chip-active' : '')}
              onClick={() => setFilter(f)}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
        >
          <option value="created">Newest</option>
          <option value="due">Due date</option>
          <option value="progress">Progress</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="muted">No todos here yet.</p>
      ) : (
        <ul className="list">
          {visible.map((todo) =>
            editingId === todo.id ? (
              <li key={todo.id} className="list-item">
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Task title"
                  />
                  <div className="row">
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as TodoPriority)}
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={editDue}
                      onChange={(e) => setEditDue(e.target.value)}
                    />
                  </div>
                  <div className="edit-actions">
                    <button className="btn-small save" onClick={() => saveEdit(todo)}>
                      Save
                    </button>
                    <button className="btn-small cancel" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <li key={todo.id} className={'todo-item' + (todo.completed ? ' done' : '')}>
                <div className="todo-head">
                  <span className="title-wrap">
                    <span className={'prio-tag prio-' + todo.priority.toLowerCase()}>
                      {todo.priority}
                    </span>
                    <span className="item-title">{todo.title}</span>
                  </span>
                  <div className="item-actions">
                    <button className="btn-icon" onClick={() => startEdit(todo)} aria-label="Edit">
                      ✎
                    </button>
                    <button className="btn-icon" onClick={() => onDelete(todo)} aria-label="Delete">
                      ✕
                    </button>
                  </div>
                </div>

                {todo.dueDate && (
                  <span className="item-sub due-line">
                    Due {todo.dueDate}
                    <DueBadge dueDate={todo.dueDate} />
                  </span>
                )}

                <div className="progress-row">
                  <input
                    className="progress-slider"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={todo.progress}
                    onChange={(e) => onProgressDrag(todo.id, Number(e.target.value))}
                    onMouseUp={(e) =>
                      commitProgress(todo, Number((e.target as HTMLInputElement).value))
                    }
                    onTouchEnd={(e) =>
                      commitProgress(todo, Number((e.target as HTMLInputElement).value))
                    }
                    aria-label="Progress"
                  />
                  <span className={'progress-pct' + (todo.completed ? ' complete' : '')}>
                    {todo.progress}%
                  </span>
                </div>

                <div className="progress-controls">
                  <button
                    className="step-btn"
                    onClick={() => stepProgress(todo, -STEP)}
                    disabled={todo.progress === 0}
                    aria-label="Decrease progress"
                  >
                    −
                  </button>
                  <button
                    className="step-btn"
                    onClick={() => stepProgress(todo, STEP)}
                    disabled={todo.progress === 100}
                    aria-label="Increase progress"
                  >
                    +
                  </button>
                  <button
                    className="done-btn"
                    onClick={() => markComplete(todo)}
                    disabled={todo.progress === 100}
                  >
                    ✓ Done
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
