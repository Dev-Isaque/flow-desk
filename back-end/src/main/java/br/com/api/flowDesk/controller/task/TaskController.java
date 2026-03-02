package br.com.api.flowDesk.controller.task;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.task.TaskDTO;
import br.com.api.flowDesk.dto.task.request.CreateTagRequest;
import br.com.api.flowDesk.dto.task.request.CreateTaskRequest;
import br.com.api.flowDesk.dto.task.request.StatusTaskRequest;
import br.com.api.flowDesk.dto.task.response.TaskResponse;
import br.com.api.flowDesk.dto.taskitem.TaskProgressDTO;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.task.TaskService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private AuthTokenService authTokenService;

    @PostMapping("/create")
    public ResponseEntity<TaskDTO> create(
            @RequestBody @Valid CreateTaskRequest dto,
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.replace("Bearer ", "").trim();

        var user = authTokenService.requireUserByToken(token);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.create(dto, user.getEmail()));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID taskId,
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.replace("Bearer ", "").trim();
        var user = authTokenService.requireUserByToken(token);

        taskService.delete(taskId, user);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskDTO> updateStatus(
            @PathVariable UUID taskId,
            @RequestBody StatusTaskRequest newStatus,
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.replace("Bearer ", "").trim();
        var user = authTokenService.requireUserByToken(token);

        return ResponseEntity.ok(taskService.updateStatus(taskId, newStatus.getStatus(), user));
    }

    @GetMapping("/{taskId}/progress")
    public ResponseEntity<TaskProgressDTO> getProgress(@PathVariable UUID taskId) {
        return ResponseEntity.ok(taskService.getTaskProgress(taskId));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable UUID taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId));
    }

    @PostMapping("/{taskId}/tags")
    public ResponseEntity<TaskDTO> addTagToTask(
            @PathVariable UUID taskId,
            @RequestBody @Valid CreateTagRequest dto) {

        return ResponseEntity.ok(taskService.addTagToTask(taskId, dto));
    }

    @DeleteMapping("/{taskId}/tags/{tagId}")
    public ResponseEntity<TaskResponse> removeTag(
            @PathVariable UUID taskId,
            @PathVariable UUID tagId) {
        TaskResponse updatedTask = taskService.removeTag(taskId, tagId);
        return ResponseEntity.ok(updatedTask);
    }

}