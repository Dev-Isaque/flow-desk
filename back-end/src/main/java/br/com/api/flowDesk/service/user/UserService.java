package br.com.api.flowDesk.service.user;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import br.com.api.flowDesk.dto.user.UserDTO;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.service.workspace.WorkspaceService;

@Service
public class UserService {

    @Value("${photo.upload-dir}")
    private String UPLOAD_DIR;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkspaceService workspaceService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserModel> findAll() {
        return userRepository.findAll();
    }

    public UserModel findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public UserModel findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    private String savePhotoFile(MultipartFile file, UUID userId) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null ||
                !(originalFilename.toLowerCase().endsWith(".jpg") ||
                        originalFilename.toLowerCase().endsWith(".jpeg") ||
                        originalFilename.toLowerCase().endsWith(".png"))) {
            throw new RuntimeException("Apenas arquivos JPG e PNG são permitidos");
        }

        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists())
                dir.mkdirs();

            String filename = userId + "_" + System.currentTimeMillis() + "_" + originalFilename;
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            Files.write(filePath, file.getBytes());

            return "/uploads/photo-user/" + filename;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar a foto: " + e.getMessage());
        }
    }

    @Transactional
    public UserModel create(UserDTO dto, MultipartFile photoFile) {

        if (!dto.getPassword().equals(dto.getPassword_confirm())) {
            throw new RuntimeException("As senhas não conferem");
        }

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Esse email já está cadastrado.");
        }

        UserModel user = new UserModel();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user = userRepository.save(user);

        String photoUrl = savePhotoFile(photoFile, user.getId());
        if (photoUrl != null) {
            user.setPhotoUrl(photoUrl);
            user = userRepository.save(user);
        }

        workspaceService.getOrCreatePersonal(user);

        return user;
    }

    @Transactional
    public UserModel update(UUID id, UserDTO dto, MultipartFile photoFile) {

        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário Não Encontrado"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        if (!dto.getPassword().equals(dto.getPassword_confirm())) {
            throw new RuntimeException("As senhas não conferem");
        }

        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        String photoUrl = savePhotoFile(photoFile, user.getId());
        if (photoUrl != null) {
            user.setPhotoUrl(photoUrl);
        }

        return userRepository.save(user);
    }
}
