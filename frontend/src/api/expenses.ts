import api from './client';
import type { Expense, ExpenseCategory, ExpenseSummary } from '../types';

export interface ExpenseInput {
  amount: number;
  category: ExpenseCategory;
  note?: string | null;
  expenseDate: string;
}

export async function getExpenses(): Promise<Expense[]> {
  const { data } = await api.get<Expense[]>('/expenses');
  return data;
}

export async function getSummary(): Promise<ExpenseSummary> {
  const { data } = await api.get<ExpenseSummary>('/expenses/summary');
  return data;
}

export async function createExpense(input: ExpenseInput): Promise<Expense> {
  const { data } = await api.post<Expense>('/expenses', input);
  return data;
}

export async function updateExpense(id: number, input: ExpenseInput): Promise<Expense> {
  const { data } = await api.put<Expense>(`/expenses/${id}`, input);
  return data;
}

export async function deleteExpense(id: number): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
