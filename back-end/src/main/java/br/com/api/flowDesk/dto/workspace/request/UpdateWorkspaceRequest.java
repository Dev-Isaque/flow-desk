package br.com.api.flowDesk.dto.workspace.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateWorkspaceRequest {

    @NotBlank(message = "name é obrigatório")
    private String name;

    private String description;
    private String color;
}
