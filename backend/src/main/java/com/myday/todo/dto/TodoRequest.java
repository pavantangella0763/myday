package com.myday.todo.dto;

import com.myday.todo.TodoPriority;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Incoming payload for create/update. "progress" (0–100) drives completion (100 = done).
 * "priority" defaults to MEDIUM when omitted.
 */
public record TodoRequest(
        @NotBlank @Size(max = 255) String title,
        @Min(0) @Max(100) Integer progress,
        TodoPriority priority,
        LocalDate dueDate
) {}
