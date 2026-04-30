package br.com.api.flowDesk.dto.workspace;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.api.flowDesk.enums.workspace.WorkspaceInviteStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WorkspaceInvitationDTO {

    private UUID id;
    private UUID workspaceId;
    private String workspaceName;
    private String workspaceColor;
    private String invitedByName;
    private LocalDateTime createdAt;
    private WorkspaceInviteStatus status;
}
