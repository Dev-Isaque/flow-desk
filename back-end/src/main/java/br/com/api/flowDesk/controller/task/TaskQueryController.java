package br.com.api.flowDesk.controller.task;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.task.TaskDTO;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.task.TaskService;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TaskQueryController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private AuthTokenService authTokenService;

    @GetMapping("/workspaces/{workspaceId}/tasks")
    public List<TaskDTO> listByWorkspace(
            @PathVariable UUID workspaceId,
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.replace("Bearer ", "").trim();
        var user = authTokenService.requireUserByToken(token);

        return taskService.listByWorkspace(workspaceId, user);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public List<TaskDTO> listByProject(
            @PathVariable UUID projectId,
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.replace("Bearer ", "").trim();
        var user = authTokenService.requireUserByToken(token);

        return taskService.listByProject(projectId, user);
    }
}
