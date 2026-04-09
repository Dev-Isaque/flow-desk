package br.com.api.flowDesk.dto.user;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserUpdateDTO {

    private String name;

    @Email(message = "Email inválido")
    private String email;

    private String password;
    private String password_confirm;

    private String currentPassword;
}