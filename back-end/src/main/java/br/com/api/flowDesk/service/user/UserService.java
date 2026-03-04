package br.com.api.flowDesk.service.user;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.api.flowDesk.dto.user.UserDTO;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.service.workspace.WorkspaceService;

@Service
public class UserService {

    @Autowired
    private UserRepository ur;

    @Autowired
    private WorkspaceService workspaceService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserModel> findAll() {
        return ur.findAll();
    }

    public UserModel findById(UUID id) {
        return ur.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public UserModel findByEmail(String email) {
        return ur.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Transactional
    public UserModel create(UserDTO dto) {

        if (!dto.getPassword().equals(dto.getPassword_confirm())) {
            throw new RuntimeException("As senhas não conferem");
        }

        if (ur.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Esse email já está cadastrado.");
        }

        UserModel user = new UserModel();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user = ur.save(user);

        workspaceService.getOrCreatePersonal(user);

        return user;
    }

    public UserModel update(UUID id, UserDTO dto) {

        UserModel user = ur.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário Não Encontrado"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        if (!dto.getPassword().equals(dto.getPassword_confirm())) {
            throw new RuntimeException("As senhas não conferem");
        }

        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        return ur.save(user);
    }
}
