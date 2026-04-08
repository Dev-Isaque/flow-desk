package br.com.api.flowDesk.service.auth;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.api.flowDesk.dto.auth.AuthResponseDTO;
import br.com.api.flowDesk.dto.auth.LoginDTO;
import br.com.api.flowDesk.dto.user.UserResponseDTO;
import br.com.api.flowDesk.model.auth.AuthTokenModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.auth.AuthTokenRepository;
import br.com.api.flowDesk.service.user.UserService;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthTokenRepository authTokenRepository;

    @Transactional
    public AuthResponseDTO login(LoginDTO dto) {

        UserModel user = userService.findByEmail(dto.getEmail());

        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos");
        }

        String token = UUID.randomUUID().toString();

        AuthTokenModel session = new AuthTokenModel();
        session.setToken(token);
        session.setUser(user);
        session.setExpiresAt(LocalDateTime.now().plusHours(12));

        authTokenRepository.save(session);

        UserResponseDTO userResponse = new UserResponseDTO(user.getId(), user.getName(), user.getEmail(),
                user.getPhotoUrl());

        return new AuthResponseDTO(
                true,
                "Login realizado com sucesso",
                token,
                userResponse);
    }
}
