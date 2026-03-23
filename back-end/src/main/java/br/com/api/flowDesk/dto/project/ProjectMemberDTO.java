package br.com.api.flowDesk.dto.project;

import java.util.UUID;

import br.com.api.flowDesk.enums.project.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProjectMemberDTO {

    private UUID id;
    private UUID userId;
    private String name;
    private String email;
    private ProjectRole role;

}
