package br.com.api.flowDesk.dto.workspace;

import java.util.UUID;

import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import lombok.Getter;

@Getter
public class WorkspaceMemberDTO {

    private UUID id;
    private String name;
    private String email;
    private WorkspaceRole role;

    public WorkspaceMemberDTO(UUID id, String name, String email, WorkspaceRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

}
