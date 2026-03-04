package br.com.api.flowDesk.dto.workspace.request;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddMemberRequest {

    @NotNull(message = "O ID do workspace é obrigatório")
    private UUID workspaceId;

    @NotBlank(message = "O email do usuário a ser adicionado é obrigatório")
    @Email(message = "Formato de email inválido")
    private String emailToAdd;

}