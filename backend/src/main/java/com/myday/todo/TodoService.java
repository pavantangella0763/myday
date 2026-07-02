package com.myday.todo;

import com.myday.todo.dto.TodoRequest;
import com.myday.todo.dto.TodoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<TodoResponse> list(Long userId) {
        return todoRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    public TodoResponse create(Long userId, TodoRequest request) {
        int progress = clampProgress(request.progress());
        Todo todo = Todo.builder()
                .userId(userId)
                .title(request.title())
                .progress(progress)
                .completed(progress >= 100)
                .priority(request.priority() != null ? request.priority() : TodoPriority.MEDIUM)
                .dueDate(request.dueDate())
                .build();
        return toResponse(todoRepository.save(todo));
    }

    public TodoResponse update(Long userId, Long id, TodoRequest request) {
        Todo todo = getOwned(userId, id);
        // If progress is omitted, keep the current value.
        int progress = request.progress() != null ? clampProgress(request.progress()) : todo.getProgress();
        todo.setTitle(request.title());
        todo.setProgress(progress);
        todo.setCompleted(progress >= 100);
        if (request.priority() != null) {
            todo.setPriority(request.priority());
        }
        todo.setDueDate(request.dueDate());
        return toResponse(todoRepository.save(todo));
    }

    public void delete(Long userId, Long id) {
        todoRepository.delete(getOwned(userId, id));
    }

    /** Loads a todo only if it belongs to the given user, else 404. Prevents cross-user access. */
    private Todo getOwned(Long userId, Long id) {
        return todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Todo not found"));
    }

    private int clampProgress(Integer value) {
        if (value == null) return 0;
        return Math.max(0, Math.min(100, value));
    }

    private TodoResponse toResponse(Todo t) {
        return new TodoResponse(t.getId(), t.getTitle(), t.isCompleted(), t.getProgress(),
                t.getPriority(), t.getDueDate());
    }
}
