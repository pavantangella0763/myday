package com.myday.expense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserIdOrderByExpenseDateDescIdDesc(Long userId);
    Optional<Expense> findByIdAndUserId(Long id, Long userId);
    List<Expense> findByUserIdAndExpenseDateBetween(Long userId, LocalDate start, LocalDate end);
}
