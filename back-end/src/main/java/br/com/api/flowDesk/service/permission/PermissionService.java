package br.com.api.flowDesk.service.permission;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import br.com.api.flowDesk.enums.project.ProjectPermission;
import br.com.api.flowDesk.enums.project.ProjectRole;
import br.com.api.flowDesk.enums.task.TaskPermission;
import br.com.api.flowDesk.enums.workspace.WorkspacePermission;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.model.task.TaskCollaboratorModel;
import br.com.api.flowDesk.model.task.TaskModel;
import br.com.api.flowDesk.model.user.UserModel;

public class PermissionService {

    public static void checkWorkspace(WorkspaceRole role, WorkspacePermission permission) {
        if (role == null || !role.hasPermission(permission)) {
            throw new RuntimeException("Sem permissão: " + permission);
        }
    }

    public static void checkProject(
            WorkspaceRole workspaceRole,
            ProjectRole projectRole,
            ProjectPermission permission) {

        if (workspaceRole == null) {
            throw new RuntimeException("Usuário não pertence ao workspace");
        }

        if (workspaceRole == WorkspaceRole.OWNER) {
            return;
        }

        if (workspaceRole == WorkspaceRole.ADMIN) {
            if (permission != ProjectPermission.DELETE_PROJECT) {
                return;
            }
        }

        if (projectRole == null || !projectRole.hasPermission(permission)) {
            throw new RuntimeException("Sem permissão: " + permission);
        }
    }

    public static void checkTaskPermission(
            WorkspaceRole workspaceRole,
            ProjectRole projectRole,
            TaskModel task,
            UserModel user,
            TaskPermission permission) {

        if (workspaceRole == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem workspace");
        }

        if (workspaceRole == WorkspaceRole.OWNER) {
            return;
        }

        if (workspaceRole == WorkspaceRole.ADMIN) {
            if (permission != TaskPermission.DELETE_TASK) {
                return;
            }
        }

        if (projectRole != null &&
                projectRole.hasPermission(mapTaskToProject(permission))) {
            return;
        }

        if (task.getCreatedBy().getId().equals(user.getId())) {
            return;
        }

        for (TaskCollaboratorModel c : task.getCollaborators()) {
            if (c.getUser().getId().equals(user.getId()) &&
                    c.getRole().hasPermission(permission)) {
                return;
            }
        }

        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Sem permissão: " + permission);
    }

    private static ProjectPermission mapTaskToProject(TaskPermission permission) {
        return switch (permission) {
            case VIEW_TASK -> ProjectPermission.VIEW_PROJECT;
            case UPDATE_TASK -> ProjectPermission.UPDATE_TASK;
            case DELETE_TASK -> ProjectPermission.DELETE_TASK;
            default -> ProjectPermission.VIEW_PROJECT;
        };
    }
}