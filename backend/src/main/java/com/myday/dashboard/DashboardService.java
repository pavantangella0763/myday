package com.myday.dashboard;

import com.myday.expense.Expense;
import com.myday.expense.ExpenseRepository;
import com.myday.expense.dto.ExpenseResponse;
import com.myday.todo.Todo;
import com.myday.todo.TodoRepository;
import com.myday.todo.dto.TodoResponse;
import com.myday.user.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

/** Aggregates todo + expense + budget data for the Home dashboard in a single response. */
@Service
public class DashboardService {

    private final TodoRepository todoRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public DashboardService(TodoRepository todoRepository,
                            ExpenseRepository expenseRepository,
                            UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse get(Long userId) {
        LocalDate today = LocalDate.now();

        List<Todo> todos = todoRepository.findByUserIdOrderByCreatedAtDesc(userId);
        long total = todos.size();
        long completed = todos.stream().filter(Todo::isCompleted).count();
        long active = total - completed;
        long dueToday = todos.stream()
                .filter(t -> !t.isCompleted() && today.equals(t.getDueDate()))
                .count();
        long overdue = todos.stream()
                .filter(t -> !t.isCompleted() && t.getDueDate() != null && t.getDueDate().isBefore(today))
                .count();

        List<TodoResponse> upcoming = todos.stream()
                .filter(t -> !t.isCompleted() && t.getDueDate() != null)
                .sorted(Comparator.comparing(Todo::getDueDate))
                .limit(5)
                .map(this::toTodo)
                .toList();

        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());
        List<Expense> monthExpenses =
                expenseRepository.findByUserIdAndExpenseDateBetween(userId, monthStart, monthEnd);
        BigDecimal spentToday = monthExpenses.stream()
                .filter(e -> today.equals(e.getExpenseDate()))
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal spentMonth = monthExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<ExpenseResponse> recent = expenseRepository.findByUserIdOrderByExpenseDateDescIdDesc(userId)
                .stream()
                .limit(5)
                .map(this::toExpense)
                .toList();

        BigDecimal budget = userRepository.findById(userId)
                .map(u -> u.getMonthlyBudget())
                .orElse(null);

        return new DashboardResponse(total, active, completed, dueToday, overdue, upcoming,
                spentToday, spentMonth, budget, recent);
    }

    private TodoResponse toTodo(Todo t) {
        return new TodoResponse(t.getId(), t.getTitle(), t.isCompleted(), t.getProgress(),
                t.getPriority(), t.getDueDate());
    }

    private ExpenseResponse toExpense(Expense e) {
        return new ExpenseResponse(e.getId(), e.getAmount(), e.getCategory(), e.getNote(), e.getExpenseDate());
    }
}
