package br.com.api.flowDesk.dto.workspace.response;

import java.util.UUID;

import br.com.api.flowDesk.enums.workspace.WorkspaceType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WorkspaceResponse {
    private UUID id;
    private String name;
    private String color;
    private WorkspaceType type;
}
