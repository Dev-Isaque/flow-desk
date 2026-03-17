package br.com.api.flowDesk.dto.project;

import java.util.UUID;

import br.com.api.flowDesk.enums.project.ProjectRole;
import lombok.Getter;

@Getter
public class ProjectMemberDTO {

    private UUID id;
    private String name;
    private String email;
    private ProjectRole role;

    public ProjectMemberDTO(UUID id, String name, String email, ProjectRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

}
