export interface AuthResponse {
  token: string;
  email: string;
  displayName: string | null;
}

export type TodoPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export const PRIORITIES: TodoPriority[] = ['HIGH', 'MEDIUM', 'LOW'];

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  progress: number; // 0–100
  priority: TodoPriority;
  dueDate: string | null;
}

export interface Profile {
  email: string;
  displayName: string | null;
  monthlyBudget: number | null;
}

export type ExpenseCategory = 'FOOD' | 'TRAVEL' | 'BILLS' | 'SHOPPING' | 'HEALTH' | 'OTHER';

export const CATEGORIES: ExpenseCategory[] = ['FOOD', 'TRAVEL', 'BILLS', 'SHOPPING', 'HEALTH', 'OTHER'];

export interface Expense {
  id: number;
  amount: number;
  category: ExpenseCategory;
  note: string | null;
  expenseDate: string;
}

export interface ExpenseSummary {
  totalToday: number;
  totalThisMonth: number;
  byCategoryThisMonth: Partial<Record<ExpenseCategory, number>>;
}
