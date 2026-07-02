import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  createExpense,
  deleteExpense,
  getExpenses,
  getSummary,
  updateExpense,
} from '../api/expenses';
import { getProfile, updateBudget } from '../api/profile';
import { CATEGORIES, type Expense, type ExpenseCategory, type ExpenseSummary } from '../types';
import CategoryChart from '../components/CategoryChart';
import { useToast } from '../components/ToastContext';
import { useConfirm } from '../components/ConfirmContext';

type SortBy = 'date' | 'amount';

function todayIso(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

const money = (n: number) => '₹' + n.toFixed(2);

export default function ExpensesPage() {
  const toast = useToast();
  const { confirm } = useConfirm();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [budgetInput, setBudgetInput] = useState('');

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('FOOD');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayIso());
  const [loading, setLoading] = useState(true);

  // View controls
  const [viewDay, setViewDay] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState<ExpenseCategory>('FOOD');
  const [editNote, setEditNote] = useState('');
  const [editDate, setEditDate] = useState('');

  async function refresh() {
    const [list, sum] = await Promise.all([getExpenses(), getSummary()]);
    setExpenses(list);
    setSummary(sum);
  }

  useEffect(() => {
    Promise.all([refresh(), getProfile()])
      .then(([, profile]) => {
        setBudget(profile.monthlyBudget);
        if (profile.monthlyBudget != null) setBudgetInput(String(profile.monthlyBudget));
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  async function onSaveBudget(e: FormEvent) {
    e.preventDefault();
    const value = parseFloat(budgetInput);
    if (isNaN(value) || value < 0) return;
    try {
      const profile = await updateBudget(value);
      setBudget(profile.monthlyBudget);
      toast.show('Budget saved');
    } catch {
      toast.show('Could not save budget', 'error');
    }
  }

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    try {
      await createExpense({ amount: value, category, note: note.trim() || null, expenseDate: date });
      setAmount('');
      setNote('');
      await refresh();
      toast.show('Expense added');
    } catch {
      toast.show('Could not add expense', 'error');
    }
  }

  async function onDelete(exp: Expense) {
    const ok = await confirm(`Delete this ${money(exp.amount)} ${exp.category} expense?`);
    if (!ok) return;
    try {
      await deleteExpense(exp.id);
      await refresh();
      toast.show('Expense deleted');
    } catch {
      toast.show('Could not delete expense', 'error');
    }
  }

  function startEdit(exp: Expense) {
    setEditingId(exp.id);
    setEditAmount(String(exp.amount));
    setEditCategory(exp.category);
    setEditNote(exp.note ?? '');
    setEditDate(exp.expenseDate);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: number) {
    const value = parseFloat(editAmount);
    if (!value || value <= 0) return;
    try {
      await updateExpense(id, {
        amount: value,
        category: editCategory,
        note: editNote.trim() || null,
        expenseDate: editDate,
      });
      setEditingId(null);
      await refresh();
      toast.show('Expense updated');
    } catch {
      toast.show('Could not save expense', 'error');
    }
  }

  const visible = useMemo(() => {
    let list = viewDay ? expenses.filter((e) => e.expenseDate === viewDay) : expenses;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) => e.category.toLowerCase().includes(q) || (e.note ?? '').toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sortBy === 'amount') sorted.sort((a, b) => b.amount - a.amount);
    else sorted.sort((a, b) => b.expenseDate.localeCompare(a.expenseDate));
    return sorted;
  }, [expenses, viewDay, search, sortBy]);

  const dayTotal = useMemo(
    () => (viewDay ? visible.reduce((s, e) => s + e.amount, 0) : null),
    [viewDay, visible],
  );

  const spent = summary?.totalThisMonth ?? 0;
  const budgetPct = budget && budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const budgetState = budget && budget > 0 ? (spent > budget ? 'over' : spent / budget >= 0.8 ? 'warn' : 'ok') : 'none';

  return (
    <div className="page">
      <h1 className="page-title">Expenses</h1>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Today</span>
          <span className="summary-value">{money(summary?.totalToday ?? 0)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">This month</span>
          <span className="summary-value">{money(spent)}</span>
        </div>
      </div>

      {/* Budget & alerts */}
      <div className="budget-card">
        <div className="budget-head">
          <span className="summary-label">Monthly budget</span>
          <form className="budget-form" onSubmit={onSaveBudget}>
            <input
              type="number"
              step="0.01"
              min="0"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Set budget"
            />
            <button className="btn-small save" type="submit">
              Save
            </button>
          </form>
        </div>
        {budget && budget > 0 && (
          <>
            <div className="budget-track">
              <div className={'budget-fill ' + budgetState} style={{ width: `${budgetPct}%` }} />
            </div>
            <div className={'budget-msg ' + budgetState}>
              {budgetState === 'over'
                ? `⚠ Over budget by ${money(spent - budget)}`
                : budgetState === 'warn'
                  ? `You've used ${Math.round((spent / budget) * 100)}% of your ${money(budget)} budget`
                  : `${money(spent)} of ${money(budget)} used`}
            </div>
          </>
        )}
      </div>

      {summary && <CategoryChart summary={summary} />}

      <form className="add-form expense-form" onSubmit={onAdd}>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="btn-primary" type="submit">
          Add expense
        </button>
      </form>

      {/* View a particular day + search + sort */}
      <div className="day-bar">
        <label className="day-label">
          View day
          <input type="date" value={viewDay} onChange={(e) => setViewDay(e.target.value)} />
        </label>
        {viewDay && (
          <button className="chip" onClick={() => setViewDay('')}>
            Clear
          </button>
        )}
      </div>

      {dayTotal != null && (
        <div className="day-total">
          Total on {viewDay}: <strong>{money(dayTotal)}</strong>
        </div>
      )}

      <input
        className="search-box"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by category or note…"
      />

      <div className="toolbar toolbar-end">
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
        >
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
        </select>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="muted">{viewDay ? 'No expenses on this day.' : 'No expenses yet.'}</p>
      ) : (
        <ul className="list">
          {visible.map((exp) =>
            editingId === exp.id ? (
              <li key={exp.id} className="list-item">
                <div className="edit-form">
                  <div className="row">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      placeholder="Amount"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as ExpenseCategory)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Note (optional)"
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                  <div className="edit-actions">
                    <button className="btn-small save" onClick={() => saveEdit(exp.id)}>
                      Save
                    </button>
                    <button className="btn-small cancel" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <li key={exp.id} className="list-item">
                <span>
                  <span className="item-title">
                    {money(exp.amount)} · {exp.category}
                  </span>
                  <span className="item-sub">
                    {exp.expenseDate}
                    {exp.note ? ` — ${exp.note}` : ''}
                  </span>
                </span>
                <div className="item-actions">
                  <button className="btn-icon" onClick={() => startEdit(exp)} aria-label="Edit">
                    ✎
                  </button>
                  <button className="btn-icon" onClick={() => onDelete(exp)} aria-label="Delete">
                    ✕
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
