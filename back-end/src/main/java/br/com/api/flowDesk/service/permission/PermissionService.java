package br.com.api.flowDesk.service.permission;

import br.com.api.flowDesk.enums.project.ProjectPermission;
import br.com.api.flowDesk.enums.project.ProjectRole;
import br.com.api.flowDesk.enums.workspace.WorkspacePermission;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;

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
}