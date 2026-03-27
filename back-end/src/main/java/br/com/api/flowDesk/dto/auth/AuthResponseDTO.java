package br.com.api.flowDesk.dto.auth;

import br.com.api.flowDesk.dto.user.UserResponseDTO;

public class AuthResponseDTO {

    private boolean sucesso;
    private String mensagem;
    private String token;
    private UserResponseDTO usuario;

    public AuthResponseDTO(boolean sucesso, String mensagem, String token, UserResponseDTO usuario) {
        this.sucesso = sucesso;
        this.mensagem = mensagem;
        this.token = token;
        this.usuario = usuario;
    }

    public boolean isSucesso() {
        return sucesso;
    }

    public String getMensagem() {
        return mensagem;
    }

    public String getToken() {
        return token;
    }

    public UserResponseDTO getUsuario() {
        return usuario;
    }
}