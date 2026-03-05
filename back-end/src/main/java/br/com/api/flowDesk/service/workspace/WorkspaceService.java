package br.com.api.flowDesk.service.workspace;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.api.flowDesk.dto.workspace.request.CreateWorkspaceRequest;
import br.com.api.flowDesk.dto.workspace.response.WorkspaceResponse;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.enums.workspace.WorkspaceType;
import br.com.api.flowDesk.model.task.WorkspaceMemberModel;
import br.com.api.flowDesk.model.task.WorkspaceModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceRepository;

@Service
public class WorkspaceService {

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public WorkspaceModel create(CreateWorkspaceRequest dto, UserModel user) {

        WorkspaceModel workspace = new WorkspaceModel();
        workspace.setName(dto.getName());
        workspace.setColor(dto.getColor());
        workspace.setType(WorkspaceType.SHARED);

        workspace = workspaceRepository.save(workspace);

        WorkspaceMemberModel member = new WorkspaceMemberModel();
        member.setWorkspace(workspace);
        member.setUser(user);
        member.setRole(WorkspaceRole.OWNER);

        workspaceMemberRepository.save(member);

        return workspace;
    }

    @Transactional
    public void addMember(UUID workspaceId, String emailToAdd, UserModel loggedUser) {

        WorkspaceModel workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace não encontrado"));

        WorkspaceMemberModel loggedMember = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(workspaceId, loggedUser.getId())
                .orElseThrow(() -> new RuntimeException("Você não pertence a esse workspace"));

        if (loggedMember.getRole() == WorkspaceRole.MEMBER ||
                loggedMember.getRole() == WorkspaceRole.VIEWER) {
            throw new RuntimeException("Sem permissão para adicionar membros");
        }

        UserModel userToAdd = userRepository.findByEmail(emailToAdd)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (workspaceMemberRepository.existsByWorkspace_IdAndUser_Id(workspaceId, userToAdd.getId())) {
            throw new RuntimeException("Usuário já é membro");
        }

        WorkspaceMemberModel newMember = new WorkspaceMemberModel();
        newMember.setWorkspace(workspace);
        newMember.setUser(userToAdd);
        newMember.setRole(WorkspaceRole.MEMBER);

        workspaceMemberRepository.save(newMember);
    }

    @Transactional
    public WorkspaceModel getOrCreatePersonal(UserModel user) {

        return workspaceRepository
                .findByTypeAndMemberUserId(WorkspaceType.PERSONAL, user.getId())
                .orElseGet(() -> {
                    WorkspaceModel ws = new WorkspaceModel();
                    ws.setName("Pessoal");
                    ws.setColor("#4f46e5");
                    ws.setType(WorkspaceType.PERSONAL);
                    ws = workspaceRepository.save(ws);

                    WorkspaceMemberModel member = new WorkspaceMemberModel();
                    member.setWorkspace(ws);
                    member.setUser(user);
                    member.setRole(WorkspaceRole.OWNER);
                    ;
                    workspaceMemberRepository.save(member);

                    return ws;
                });
    }

    public List<WorkspaceResponse> findAllSharedByUser(UUID userId) {

        var workspaces = workspaceRepository
                .findDistinctByMembers_User_IdAndType(userId, WorkspaceType.SHARED);

        return workspaces.stream()
                .map(ws -> new WorkspaceResponse(
                        ws.getId(),
                        ws.getName(),
                        ws.getColor(),
                        ws.getType(),
                        ws.getMembers().size()))
                .toList();
    }
}