package br.com.api.flowDesk.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class UserCreateDTO {

    @NotBlank
    private String name;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    private String password;

    @NotBlank(message = "Confirmação de senha é obrigatória")
    private String password_confirm;

    private String photoUrl;
}
