package br.com.api.flowDesk.controller.task;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.task.request.TransferTaskOwnerRequest;
import br.com.api.flowDesk.dto.task.response.TaskCollaboratorResponseDTO;
import br.com.api.flowDesk.enums.task.TaskRole;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.task.TaskCollaboratorService;

@RestController
@RequestMapping("/tasks/{taskId}/collaborators")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TaskCollaboratorController {

    @Autowired
    private TaskCollaboratorService taskCollaboratorService;

    @Autowired
    private AuthTokenService authTokenService;

    @GetMapping
    public ResponseEntity<List<TaskCollaboratorResponseDTO>> list(
            @PathVariable UUID taskId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        return ResponseEntity.ok(
                taskCollaboratorService.list(taskId, user));
    }

    @PostMapping
    public ResponseEntity<Void> addCollaborator(
            @PathVariable UUID taskId,
            @RequestParam UUID userId,
            @RequestParam TaskRole role,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        taskCollaboratorService.addCollaborator(taskId, userId, role, user);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeCollaborator(
            @PathVariable UUID taskId,
            @PathVariable UUID userId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        taskCollaboratorService.removeCollaborator(taskId, userId, user);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/owner")
    public ResponseEntity<Void> transferOwner(
            @PathVariable UUID taskId,
            @RequestBody TransferTaskOwnerRequest request,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        taskCollaboratorService.transferOwnership(taskId, request.getUserId(), user);

        return ResponseEntity.noContent().build();
    }
}
