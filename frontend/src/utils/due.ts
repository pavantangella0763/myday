/**
 * Turns a due date (YYYY-MM-DD) into a short urgency badge, or null when it's far off / unset.
 * Used by the Todos list and the dashboard so due-status styling stays consistent.
 */
export interface DueBadge {
  text: string;
  cls: 'overdue' | 'today' | 'soon';
}

export function dueBadge(dueDate: string | null): DueBadge | null {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return { text: 'Overdue', cls: 'overdue' };
  if (diffDays === 0) return { text: 'Due today', cls: 'today' };
  if (diffDays === 1) return { text: 'Tomorrow', cls: 'soon' };
  if (diffDays <= 7) return { text: `In ${diffDays} days`, cls: 'soon' };
  return null;
}
