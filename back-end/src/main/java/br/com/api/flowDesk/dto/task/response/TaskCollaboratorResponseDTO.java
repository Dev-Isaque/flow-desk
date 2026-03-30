package br.com.api.flowDesk.dto.task.response;

import java.util.UUID;

import br.com.api.flowDesk.enums.task.TaskRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TaskCollaboratorResponseDTO {

    private UUID userId;
    private String name;
    private TaskRole role;

}
