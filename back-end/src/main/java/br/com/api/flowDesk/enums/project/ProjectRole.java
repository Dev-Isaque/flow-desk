package br.com.api.flowDesk.enums.project;

import java.util.Set;

public enum ProjectRole {

    MANAGER(Set.of(
            ProjectPermission.ASSIGN_TASK,
            ProjectPermission.VIEW_PROJECT,
            ProjectPermission.UPDATE_PROJECT,
            ProjectPermission.DELETE_PROJECT,
            ProjectPermission.CREATE_TASK,
            ProjectPermission.ADD_MEMBER,
            ProjectPermission.REMOVE_MEMBER,
            ProjectPermission.UPDATE_MEMBER_ROLE)),

    CONTRIBUTOR(Set.of(
            ProjectPermission.ASSIGN_TASK,
            ProjectPermission.VIEW_PROJECT,
            ProjectPermission.CREATE_TASK)),

    VIEWER(Set.of(
            ProjectPermission.VIEW_PROJECT));

    private final Set<ProjectPermission> permissions;

    ProjectRole(Set<ProjectPermission> permissions) {
        this.permissions = permissions;
    }

    public boolean hasPermission(ProjectPermission permission) {
        return permissions.contains(permission);
    }
}