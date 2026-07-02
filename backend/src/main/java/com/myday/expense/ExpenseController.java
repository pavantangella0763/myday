package com.myday.expense;

import com.myday.expense.dto.ExpenseRequest;
import com.myday.expense.dto.ExpenseResponse;
import com.myday.expense.dto.ExpenseSummaryResponse;
import com.myday.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<ExpenseResponse> list(@AuthenticationPrincipal UserPrincipal principal) {
        return expenseService.list(principal.getId());
    }

    @GetMapping("/summary")
    public ExpenseSummaryResponse summary(@AuthenticationPrincipal UserPrincipal principal) {
        return expenseService.summary(principal.getId());
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@AuthenticationPrincipal UserPrincipal principal,
                                                  @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.create(principal.getId(), request));
    }

    @PutMapping("/{id}")
    public ExpenseResponse update(@AuthenticationPrincipal UserPrincipal principal,
                                  @PathVariable Long id,
                                  @Valid @RequestBody ExpenseRequest request) {
        return expenseService.update(principal.getId(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserPrincipal principal,
                                       @PathVariable Long id) {
        expenseService.delete(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
