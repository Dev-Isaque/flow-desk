package br.com.api.flowDesk.enums.task;

import java.util.Set;

public enum TaskRole {

    OWNER(Set.of(
            TaskPermission.VIEW_TASK,
            TaskPermission.UPDATE_TASK,
            TaskPermission.DELETE_TASK,
            TaskPermission.ADD_ATTACHMENT,
            TaskPermission.ADD_COLLABORATOR,
            TaskPermission.REMOVE_COLLABORATOR)),

    COLLABORATOR(Set.of(
            TaskPermission.VIEW_TASK,
            TaskPermission.UPDATE_TASK,
            TaskPermission.ADD_ATTACHMENT,
            TaskPermission.COMMENT)),

    VIEWER(Set.of(
            TaskPermission.VIEW_TASK));

    private final Set<TaskPermission> permissions;

    TaskRole(Set<TaskPermission> permissions) {
        this.permissions = permissions;
    }

    public boolean hasPermission(TaskPermission permission) {
        return permissions.contains(permission);
    }
}