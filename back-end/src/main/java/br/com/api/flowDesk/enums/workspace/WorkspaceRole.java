package br.com.api.flowDesk.enums.workspace;

import java.util.Set;

public enum WorkspaceRole {

        OWNER(Set.of(
                        WorkspacePermission.CREATE_PROJECT,
                        WorkspacePermission.EDIT_PROJECT,
                        WorkspacePermission.DELETE_PROJECT,
                        WorkspacePermission.ADD_MEMBER,
                        WorkspacePermission.UPDATE_MEMBER_ROLE,
                        WorkspacePermission.REMOVE_MEMBER,
                        WorkspacePermission.VIEW_PROJECT,
                        WorkspacePermission.UPDATE_WORKSPACE,
                        WorkspacePermission.DELETE_WORKSPACE)),

        ADMIN(Set.of(
                        WorkspacePermission.CREATE_PROJECT,
                        WorkspacePermission.EDIT_PROJECT,
                        WorkspacePermission.ADD_MEMBER,
                        WorkspacePermission.UPDATE_MEMBER_ROLE,
                        WorkspacePermission.REMOVE_MEMBER,
                        WorkspacePermission.VIEW_PROJECT,
                        WorkspacePermission.UPDATE_WORKSPACE)),

        MEMBER(Set.of(
                        WorkspacePermission.VIEW_PROJECT)),

        VIEWER(Set.of(
                        WorkspacePermission.VIEW_PROJECT));

        private final Set<WorkspacePermission> permissions;

        WorkspaceRole(Set<WorkspacePermission> permissions) {
                this.permissions = permissions;
        }

        public boolean hasPermission(WorkspacePermission permission) {
                return permissions.contains(permission);
        }
}