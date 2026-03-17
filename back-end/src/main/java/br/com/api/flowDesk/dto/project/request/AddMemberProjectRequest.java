package br.com.api.flowDesk.dto.project.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddMemberProjectRequest {
    @NotBlank(message = "O email do usuário a ser adicionado é obrigatório")
    @Email(message = "Formato de email inválido")
    private String emailToAdd;

}