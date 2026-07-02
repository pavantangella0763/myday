package com.myday.todo.dto;

import com.myday.todo.TodoPriority;

import java.time.LocalDate;

public record TodoResponse(
        Long id,
        String title,
        boolean completed,
        int progress,
        TodoPriority priority,
        LocalDate dueDate
) {}
