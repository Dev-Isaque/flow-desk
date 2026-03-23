package br.com.api.flowDesk.dto.project.request;

import java.util.UUID;

import br.com.api.flowDesk.enums.project.ProjectRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddMemberProjectRequest {

    private UUID memberId;
    private ProjectRole role;

}