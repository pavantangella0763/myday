package com.myday.expense;

import com.myday.expense.dto.ExpenseRequest;
import com.myday.expense.dto.ExpenseResponse;
import com.myday.expense.dto.ExpenseSummaryResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<ExpenseResponse> list(Long userId) {
        return expenseRepository.findByUserIdOrderByExpenseDateDescIdDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    public ExpenseResponse create(Long userId, ExpenseRequest request) {
        Expense expense = Expense.builder()
                .userId(userId)
                .amount(request.amount())
                .category(request.category())
                .note(request.note())
                .expenseDate(request.expenseDate())
                .build();
        return toResponse(expenseRepository.save(expense));
    }

    public ExpenseResponse update(Long userId, Long id, ExpenseRequest request) {
        Expense expense = getOwned(userId, id);
        expense.setAmount(request.amount());
        expense.setCategory(request.category());
        expense.setNote(request.note());
        expense.setExpenseDate(request.expenseDate());
        return toResponse(expenseRepository.save(expense));
    }

    public void delete(Long userId, Long id) {
        expenseRepository.delete(getOwned(userId, id));
    }

    /** Computes today's total, this month's total, and per-category totals for this month. */
    public ExpenseSummaryResponse summary(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());

        List<Expense> monthExpenses =
                expenseRepository.findByUserIdAndExpenseDateBetween(userId, monthStart, monthEnd);

        BigDecimal totalToday = monthExpenses.stream()
                .filter(e -> e.getExpenseDate().isEqual(today))
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalMonth = monthExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<ExpenseCategory, BigDecimal> byCategory = new EnumMap<>(ExpenseCategory.class);
        for (Expense e : monthExpenses) {
            byCategory.merge(e.getCategory(), e.getAmount(), BigDecimal::add);
        }

        return new ExpenseSummaryResponse(totalToday, totalMonth, byCategory);
    }

    private Expense getOwned(Long userId, Long id) {
        return expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));
    }

    private ExpenseResponse toResponse(Expense e) {
        return new ExpenseResponse(e.getId(), e.getAmount(), e.getCategory(), e.getNote(), e.getExpenseDate());
    }
}
