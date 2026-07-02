import api from './client';
import type { Todo, TodoPriority } from '../types';

export interface TodoInput {
  title: string;
  progress?: number; // 0–100
  priority?: TodoPriority;
  dueDate?: string | null;
}

export async function getTodos(): Promise<Todo[]> {
  const { data } = await api.get<Todo[]>('/todos');
  return data;
}

export async function createTodo(input: TodoInput): Promise<Todo> {
  const { data } = await api.post<Todo>('/todos', input);
  return data;
}

export async function updateTodo(id: number, input: TodoInput): Promise<Todo> {
  const { data } = await api.put<Todo>(`/todos/${id}`, input);
  return data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}
