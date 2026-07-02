package com.myday.expense.dto;

import com.myday.expense.ExpenseCategory;

import java.math.BigDecimal;
import java.util.Map;

/** Dashboard numbers: today's total, this month's total, and this month's total per category. */
public record ExpenseSummaryResponse(
        BigDecimal totalToday,
        BigDecimal totalThisMonth,
        Map<ExpenseCategory, BigDecimal> byCategoryThisMonth
) {}
