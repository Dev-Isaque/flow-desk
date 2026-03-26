package br.com.api.flowDesk.dto.project.response;

import java.util.UUID;

import br.com.api.flowDesk.enums.project.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProjectResponse {

        private UUID id;
        private String name;
        private String description;
        private Integer tasksCount;
        private Integer membersCount;
        private ProjectRole role;

}