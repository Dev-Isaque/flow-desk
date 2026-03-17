package br.com.api.flowDesk.controller.task;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.taskitem.TaskItemDTO;
import br.com.api.flowDesk.dto.taskitem.request.CreateTaskItemRequest;
import br.com.api.flowDesk.dto.taskitem.request.UpdateTaskItemDoneRequest;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.task.TaskItemService;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TaskItemController {

    @Autowired
    private TaskItemService taskItemService;

    @Autowired
    private AuthTokenService authTokenService;

    @GetMapping("/tasks/{taskId}/items")
    public List<TaskItemDTO> listByTask(@PathVariable UUID taskId) {
        return taskItemService.listByTask(taskId);
    }

    @PostMapping("/tasks/{taskId}/items")
    public ResponseEntity<TaskItemDTO> create(
            @PathVariable UUID taskId,
            @RequestBody @Valid CreateTaskItemRequest dto,
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.replace("Bearer ", "").trim();
        authTokenService.requireUserByToken(token);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskItemService.create(taskId, dto));
    }

    @PatchMapping("/task-items/{itemId}/done")
    public TaskItemDTO setDone(
            @PathVariable UUID itemId,
            @RequestBody UpdateTaskItemDoneRequest dto,
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.replace("Bearer ", "").trim();
        authTokenService.requireUserByToken(token);

        return taskItemService.setDone(itemId, dto.getDone());
    }

    @DeleteMapping("/task-items/{itemId}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID itemId,
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.replace("Bearer ", "").trim();
        authTokenService.requireUserByToken(token);

        taskItemService.delete(itemId);
        return ResponseEntity.noContent().build();
    }
}
