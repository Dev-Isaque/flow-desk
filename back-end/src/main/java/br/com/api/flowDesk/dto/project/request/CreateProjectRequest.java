package br.com.api.flowDesk.dto.project.request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProjectRequest {

    @NotNull(message = "workspaceId é obrigatório")
    private UUID workspaceId;

    @NotBlank(message = "name é obrigatório")
    private String name;

    private String description;
}
