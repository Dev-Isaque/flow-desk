package br.com.api.flowDesk.dto.user;

import java.util.UUID;

import lombok.Getter;

@Getter
public class UserResponseDTO {

    private UUID id;
    private String name;
    private String email;
    private String photoUrl;

    public UserResponseDTO(UUID id, String name, String email, String photoUrl, String baseUrl) {
        this.id = id;
        this.name = name;
        this.email = email;

        this.photoUrl = (photoUrl != null && !photoUrl.isEmpty())
                ? baseUrl + "/users/" + id + "/photo"
                : null;
    }
}