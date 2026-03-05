package br.com.api.flowDesk.dto.workspace.dto;

import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WorkspaceMemberDTO {

    private String name;
    private String email;
    private WorkspaceRole role;

}
