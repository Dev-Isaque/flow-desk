package br.com.api.flowDesk.controller.user;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import br.com.api.flowDesk.dto.user.UserCreateDTO;
import br.com.api.flowDesk.dto.user.UserResponseDTO;
import br.com.api.flowDesk.dto.user.UserUpdateDTO;
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

        UserResponseDTO dto = service.toDTO(user);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/email")
    public ResponseEntity<UserModel> findByEmail(@RequestParam String email) {
        return ResponseEntity.ok(service.findByEmail(email));
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<Resource> getUserPhoto(@PathVariable UUID id) throws Exception {
        UserModel user = service.findById(id);

        if (user.getPhotoUrl() == null) {
            return ResponseEntity.notFound().build();
        }

        String fileName = Paths.get(user.getPhotoUrl()).getFileName().toString();
        Path path = Paths.get("uploads/photo-user").resolve(fileName);

        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(path.toUri());
        String contentType = Files.probeContentType(path);

        return ResponseEntity.ok()
                .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                .body(resource);
    }

    @PostMapping(value = "/register", consumes = { "multipart/form-data" })
    public ResponseEntity<UserModel> create(
            @Valid @ModelAttribute UserCreateDTO dto,
            @RequestParam(value = "photoFile", required = false) MultipartFile photoFile) {

        UserModel user = service.create(dto, photoFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PatchMapping(value = "/update/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<UserModel> update(
            @PathVariable UUID id,
            @ModelAttribute UserUpdateDTO dto,
            @RequestParam(value = "photoFile", required = false) MultipartFile photoFile,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        UserModel loggedUser = authTokenService.requireUserByToken(token);
        if (!loggedUser.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você só pode atualizar o próprio usuário");
        }

        UserModel user = service.update(id, dto, photoFile);
        return ResponseEntity.ok(user);
    }
}