package com.myday.todo;

import com.myday.security.UserPrincipal;
import com.myday.todo.dto.TodoRequest;
import com.myday.todo.dto.TodoResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public List<TodoResponse> list(@AuthenticationPrincipal UserPrincipal principal) {
        return todoService.list(principal.getId());
    }

    @PostMapping
    public ResponseEntity<TodoResponse> create(@AuthenticationPrincipal UserPrincipal principal,
                                               @Valid @RequestBody TodoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(todoService.create(principal.getId(), request));
    }

    @PutMapping("/{id}")
    public TodoResponse update(@AuthenticationPrincipal UserPrincipal principal,
                               @PathVariable Long id,
                               @Valid @RequestBody TodoRequest request) {
        return todoService.update(principal.getId(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserPrincipal principal,
                                       @PathVariable Long id) {
        todoService.delete(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
