package br.com.api.flowDesk.service.permission;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import br.com.api.flowDesk.enums.project.ProjectPermission;
import br.com.api.flowDesk.enums.project.ProjectRole;
import br.com.api.flowDesk.enums.task.TaskPermission;
import br.com.api.flowDesk.enums.task.TaskRole;
import br.com.api.flowDesk.enums.workspace.WorkspacePermission;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.model.task.TaskCollaboratorModel;
import br.com.api.flowDesk.model.task.TaskModel;
import br.com.api.flowDesk.model.user.UserModel;

public class PermissionService {

    public static void checkWorkspace(WorkspaceRole role, WorkspacePermission permission) {
        if (role == null || !role.hasPermission(permission)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Sem permissão: " + permission);
        }
    }

    public static void checkProject(
            WorkspaceRole workspaceRole,
            ProjectRole projectRole,
            ProjectPermission permission) {

        if (workspaceRole == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem workspace");
        }

        if (workspaceRole == WorkspaceRole.OWNER) {
            return;
        }

        if (workspaceRole == WorkspaceRole.ADMIN &&
                permission != ProjectPermission.DELETE_PROJECT) {
            return;
        }

        if (projectRole == null || !projectRole.hasPermission(permission)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Sem permissão: " + permission);
        }
    }

    public static void checkTaskPermission(
            WorkspaceRole workspaceRole,
            ProjectRole projectRole,
            TaskModel task,
            UserModel user,
            TaskPermission permission) {

        if (!canAccessTask(workspaceRole, projectRole, task, user, permission)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Sem permissão: " + permission);
        }
    }

    public static boolean canViewTask(
            WorkspaceRole workspaceRole,
            ProjectRole projectRole,
            TaskModel task,
            UserModel user) {

        return canAccessTask(
                workspaceRole,
                projectRole,
                task,
                user,
                TaskPermission.VIEW_TASK);
    }

    public static boolean canAccessTask(
            WorkspaceRole workspaceRole,
            ProjectRole projectRole,
            TaskModel task,
            UserModel user,
            TaskPermission permission) {

        if (workspaceRole == null)
            return false;

        if (workspaceRole == WorkspaceRole.OWNER)
            return true;

        if (workspaceRole == WorkspaceRole.ADMIN &&
                permission != TaskPermission.DELETE_TASK) {
            return true;
        }

        if (projectRole == ProjectRole.MANAGER) {
            return true;
        }

        if (permission == TaskPermission.VIEW_TASK) {

            if (task.getCreatedBy() != null &&
                    task.getCreatedBy().getId().equals(user.getId())) {
                return true;
            }

            if (task.getCollaborators() != null) {
                for (TaskCollaboratorModel c : task.getCollaborators()) {
                    if (c.getUser() != null &&
                            c.getUser().getId().equals(user.getId())) {
                        return true;
                    }
                }
            }

            return false;
        }

        if (projectRole != null &&
                projectRole.hasPermission(mapTaskToProject(permission))) {
            return true;
        }

        if (task.getCreatedBy() != null &&
                task.getCreatedBy().getId().equals(user.getId())) {
            return true;
        }

        if (task.getCollaborators() != null) {
            for (TaskCollaboratorModel c : task.getCollaborators()) {
                if (c.getUser() != null &&
                        c.getUser().getId().equals(user.getId()) &&
                        c.getRole().hasPermission(permission)) {
                    return true;
                }
            }
        }

        return false;
    }

    private static ProjectPermission mapTaskToProject(TaskPermission permission) {
        return switch (permission) {
            case VIEW_TASK -> ProjectPermission.VIEW_PROJECT;
            case UPDATE_TASK -> ProjectPermission.UPDATE_TASK;
            case DELETE_TASK -> ProjectPermission.DELETE_TASK;
            default -> ProjectPermission.VIEW_PROJECT;
        };
    }

    public static TaskRole getUserTaskRole(TaskModel task, UserModel user) {
        if (task == null || user == null)
            return null;

        if (task.getCreatedBy() != null &&
                task.getCreatedBy().getId().equals(user.getId())) {
            return TaskRole.OWNER;
        }

        if (task.getCollaborators() != null) {
            for (TaskCollaboratorModel c : task.getCollaborators()) {
                if (c.getUser() != null &&
                        c.getUser().getId().equals(user.getId())) {
                    return c.getRole();
                }
            }
        }

        return null;
    }
}