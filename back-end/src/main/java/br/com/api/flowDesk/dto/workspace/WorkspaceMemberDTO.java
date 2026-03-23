package br.com.api.flowDesk.dto.workspace;

import java.util.UUID;

import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WorkspaceMemberDTO {

    private UUID id;
    private UUID userId;
    private String name;
    private String email;
    private WorkspaceRole role;

}
