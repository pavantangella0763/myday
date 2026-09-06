import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/dashboard';
import type { DashboardData } from '../types';
import { useAuth } from '../auth/AuthContext';
import { dueBadge } from '../utils/due';

const money = (n: number) => '₹' + n.toFixed(2);

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { displayName } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <p className="muted">Could not load your dashboard.</p>
      </div>
    );
  }

  const budget = data.monthlyBudget;
  const overBudget = budget != null && budget > 0 && data.spentThisMonth > budget;

  return (
    <div className="page">
      <h1 className="page-title">
        {greeting()}
        {displayName ? `, ${displayName}` : ''} 👋
      </h1>

      <div className="stat-grid">
        <Link to="/todos" className="stat-tile">
          <span className="stat-num">{data.activeTodos}</span>
          <span className="stat-label">Active tasks</span>
        </Link>
        <Link to="/todos" className="stat-tile">
          <span className="stat-num">{data.dueToday}</span>
          <span className="stat-label">Due today</span>
        </Link>
        <Link to="/todos" className={'stat-tile' + (data.overdue > 0 ? ' danger' : '')}>
          <span className="stat-num">{data.overdue}</span>
          <span className="stat-label">Overdue</span>
        </Link>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Spent today</span>
          <span className="summary-value">{money(data.spentToday)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">This month</span>
          <span className="summary-value">{money(data.spentThisMonth)}</span>
        </div>
      </div>

      {budget != null && budget > 0 && (
        <div className={'dash-budget' + (overBudget ? ' over' : '')}>
          {overBudget
            ? `⚠ Over budget by ${money(data.spentThisMonth - budget)}`
            : `${money(data.spentThisMonth)} of ${money(budget)} monthly budget used`}
        </div>
      )}

      <div className="dash-section">
        <div className="dash-section-head">
          <h2>Upcoming tasks</h2>
          <Link to="/todos" className="see-all">
            See all
          </Link>
        </div>
        {data.upcomingTodos.length === 0 ? (
          <p className="muted small">Nothing due — you're all caught up 🎉</p>
        ) : (
          <ul className="dash-list">
            {data.upcomingTodos.map((t) => {
              const badge = dueBadge(t.dueDate);
              return (
                <li key={t.id} className="dash-item">
                  <span className={'prio-dot prio-' + t.priority.toLowerCase()} />
                  <span className="dash-item-title">{t.title}</span>
                  {badge && <span className={'due-badge ' + badge.cls}>{badge.text}</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="dash-section">
        <div className="dash-section-head">
          <h2>Recent expenses</h2>
          <Link to="/expenses" className="see-all">
            See all
          </Link>
        </div>
        {data.recentExpenses.length === 0 ? (
          <p className="muted small">No expenses yet.</p>
        ) : (
          <ul className="dash-list">
            {data.recentExpenses.map((e) => (
              <li key={e.id} className="dash-item">
                <span className="dash-item-title">
                  {e.category}
                  {e.note ? ` — ${e.note}` : ''}
                </span>
                <span className="dash-amount">{money(e.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
