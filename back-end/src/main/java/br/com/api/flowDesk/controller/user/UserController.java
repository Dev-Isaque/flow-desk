package br.com.api.flowDesk.controller.user;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.user.UserDTO;
import br.com.api.flowDesk.dto.user.UserResponseDTO;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.user.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private AuthTokenService authTokenService;

    @GetMapping
    public ResponseEntity<List<UserModel>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserModel> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> me(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();

        UserModel user = authTokenService.requireUserByToken(token);

        UserResponseDTO dto = new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail());

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/email")
    public ResponseEntity<UserModel> findByEmail(@RequestParam String email) {
        return ResponseEntity.ok(service.findByEmail(email));
    }

    @PostMapping("/register")
    public ResponseEntity<UserModel> create(@Valid @RequestBody UserDTO dto) {
        UserModel user = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("update/{id}")
    public ResponseEntity<UserModel> update(
            @PathVariable UUID id,
            @Valid @RequestBody UserDTO dto) {

        UserModel user = service.update(id, dto);
        return ResponseEntity.ok(user);
    }

}