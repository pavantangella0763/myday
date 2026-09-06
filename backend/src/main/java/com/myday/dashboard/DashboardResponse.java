package com.myday.dashboard;

import com.myday.expense.dto.ExpenseResponse;
import com.myday.todo.dto.TodoResponse;

import java.math.BigDecimal;
import java.util.List;

/** Aggregated snapshot for the Home dashboard. */
public record DashboardResponse(
        long totalTodos,
        long activeTodos,
        long completedTodos,
        long dueToday,
        long overdue,
        List<TodoResponse> upcomingTodos,
        BigDecimal spentToday,
        BigDecimal spentThisMonth,
        BigDecimal monthlyBudget,
        List<ExpenseResponse> recentExpenses
) {}
