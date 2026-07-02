package com.myday.expense.dto;

import com.myday.expense.ExpenseCategory;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        BigDecimal amount,
        ExpenseCategory category,
        String note,
        LocalDate expenseDate
) {}
