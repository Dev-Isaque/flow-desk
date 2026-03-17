package br.com.api.flowDesk.dto.workspace.response;

import java.util.UUID;

import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.enums.workspace.WorkspaceType;
import lombok.Getter;

@Getter
public class WorkspaceResponse {

    private UUID id;
    private String name;
    private String color;
    private WorkspaceType type;
    private Integer memberCount;
    private WorkspaceRole role;

    public WorkspaceResponse(
            UUID id,
            String name,
            String color,
            WorkspaceType type,
            Integer memberCount,
            WorkspaceRole role) {

        this.id = id;
        this.name = name;
        this.color = color;
        this.type = type;
        this.memberCount = memberCount;
        this.role = role;
    }
}