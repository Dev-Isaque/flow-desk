package br.com.api.flowDesk.service.project;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.api.flowDesk.dto.project.request.CreateProjectRequest;
import br.com.api.flowDesk.dto.project.response.ProjectResponse;
import br.com.api.flowDesk.enums.project.ProjectRole;
import br.com.api.flowDesk.enums.workspace.WorkspacePermission;
import br.com.api.flowDesk.model.project.ProjectMemberModel;
import br.com.api.flowDesk.model.project.ProjectModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.project.ProjectMemberRepository;
import br.com.api.flowDesk.repository.project.ProjectRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceRepository;
import br.com.api.flowDesk.service.permission.PermissionService;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Transactional
    public ProjectModel create(CreateProjectRequest dto, UserModel user) {

        var workspace = workspaceRepository.findById(dto.getWorkspaceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace não encontrado"));

        var member = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(workspace.getId(), user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não pertence ao workspace"));

        PermissionService.checkWorkspace(member.getRole(), WorkspacePermission.CREATE_PROJECT);

        var project = new ProjectModel();
        project.setWorkspace(workspace);
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());

        var savedProject = projectRepository.save(project);

        var projectMember = new ProjectMemberModel();
        projectMember.setProject(savedProject);
        projectMember.setUser(user);
        projectMember.setRole(ProjectRole.MANAGER);

        projectMemberRepository.save(projectMember);

        return savedProject;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> findProjectsByWorkspace(UUID workspaceId, UserModel user) {

        var member = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(workspaceId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Você não pertence ao workspace"));

        return projectRepository.findProjectsWithRole(workspaceId, user.getId());
    }
}