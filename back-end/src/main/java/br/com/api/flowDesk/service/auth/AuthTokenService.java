package br.com.api.flowDesk.service.auth;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.service.user.UserService;

@Service
public class AuthTokenService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    public UserModel requireUserByToken(String token) {

        if (!jwtService.isValid(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado");
        }

        UUID userId = jwtService.getUserId(token);
        return userService.findById(userId);
    }
}