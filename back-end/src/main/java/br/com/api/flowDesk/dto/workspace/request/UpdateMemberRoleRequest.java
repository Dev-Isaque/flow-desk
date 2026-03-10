package br.com.api.flowDesk.dto.workspace.request;

import br.com.api.flowDesk.enums.workspace.WorkspaceRole;

public class UpdateMemberRoleRequest {

    private WorkspaceRole role;

    public WorkspaceRole getRole() {
        return role;
    }

    public void setRole(WorkspaceRole role) {
        this.role = role;
    }
}