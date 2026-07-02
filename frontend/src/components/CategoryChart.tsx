import { CATEGORIES, type ExpenseCategory, type ExpenseSummary } from '../types';

const COLORS: Record<ExpenseCategory, string> = {
  FOOD: '#f59e0b',
  TRAVEL: '#3b82f6',
  BILLS: '#ef4444',
  SHOPPING: '#8b5cf6',
  HEALTH: '#10b981',
  OTHER: '#6b7280',
};

/** Donut chart of this month's spending by category. Renders nothing when there's no data. */
export default function CategoryChart({ summary }: { summary: ExpenseSummary }) {
  const entries = CATEGORIES.map((category) => ({
    category,
    amount: summary.byCategoryThisMonth[category] ?? 0,
  })).filter((e) => e.amount > 0);

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  if (total <= 0) return null;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="chart-card">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <g transform="rotate(-90 70 70)">
          {entries.map((e) => {
            const dash = (e.amount / total) * circumference;
            const segment = (
              <circle
                key={e.category}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={COLORS[e.category]}
                strokeWidth="20"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return segment;
          })}
        </g>
        <text x="70" y="64" textAnchor="middle" className="donut-center">
          This month
        </text>
        <text x="70" y="84" textAnchor="middle" className="donut-total">
          ₹{total.toFixed(2)}
        </text>
      </svg>
      <div className="chart-legend">
        {entries.map((e) => (
          <div key={e.category} className="legend-row">
            <span className="legend-dot" style={{ background: COLORS[e.category] }} />
            <span>{e.category}</span>
            <span className="legend-amount">₹{e.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
