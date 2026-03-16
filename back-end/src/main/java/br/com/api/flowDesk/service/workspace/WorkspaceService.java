package br.com.api.flowDesk.service.workspace;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.api.flowDesk.dto.workspace.request.CreateWorkspaceRequest;
import br.com.api.flowDesk.dto.workspace.request.UpdateWorkspaceRequest;
import br.com.api.flowDesk.dto.workspace.response.WorkspaceResponse;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.enums.workspace.WorkspaceType;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.model.workspace.WorkspaceMemberModel;
import br.com.api.flowDesk.model.workspace.WorkspaceModel;
import br.com.api.flowDesk.repository.project.ProjectRepository;
import br.com.api.flowDesk.repository.task.TaskRepository;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceRepository;
import br.com.api.flowDesk.service.task.TaskService;

@Service
public class WorkspaceService {

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskService taskService;

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
    public WorkspaceModel update(UUID workspaceId, UpdateWorkspaceRequest dto, UserModel user) {

        WorkspaceModel workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace não encontrado"));

        WorkspaceMemberModel member = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(workspaceId, user.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não pertence a este workspace"));

        if (member.getRole() != WorkspaceRole.OWNER && member.getRole() != WorkspaceRole.ADMIN) {
            throw new RuntimeException("Sem permissão para atualizar o workspace");
        }

        if (dto.getName() != null && !dto.getName().isBlank()) {
            workspace.setName(dto.getName());
        }

        if (dto.getColor() != null && !dto.getColor().isBlank()) {
            workspace.setColor(dto.getColor());
        }

        return workspaceRepository.save(workspace);
    }

    @Transactional
    public void delete(UUID workspaceId, UserModel user) {

        WorkspaceModel workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace não encontrado"));

        if (workspace.getType() == WorkspaceType.PERSONAL) {
            throw new RuntimeException("Workspace pessoal não pode ser removido");
        }

        WorkspaceMemberModel member = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(workspaceId, user.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não pertence ao workspace"));

        if (member.getRole() != WorkspaceRole.OWNER) {
            throw new RuntimeException("Apenas o OWNER pode deletar o workspace");
        }

        var tasks = taskRepository.findByProject_Workspace_Id(workspaceId);

        for (var task : tasks) {
            taskService.delete(task.getId(), user);
        }

        projectRepository.deleteByWorkspaceId(workspaceId);

        workspaceMemberRepository.deleteAll(workspace.getMembers());

        workspaceRepository.delete(workspace);
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