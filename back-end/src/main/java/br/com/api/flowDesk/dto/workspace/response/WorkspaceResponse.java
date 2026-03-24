package br.com.api.flowDesk.dto.workspace.response;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.enums.workspace.WorkspaceType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WorkspaceResponse {

    private UUID id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private String color;
    private WorkspaceType type;
    private Integer memberCount;
    private WorkspaceRole role;
}