package br.com.api.flowDesk.service.project;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.api.flowDesk.dto.project.request.CreateProjectRequest;
import br.com.api.flowDesk.dto.project.request.UpdateProjectRequest;
import br.com.api.flowDesk.dto.project.response.ProjectResponse;
import br.com.api.flowDesk.enums.project.ProjectRole;
import br.com.api.flowDesk.enums.workspace.WorkspacePermission;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
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
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Workspace não encontrado"));

                var member = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(workspace.getId(), user.getId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                                                "Você não pertence ao workspace"));

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

        @Transactional
        public ProjectModel update(UUID projectId, UpdateProjectRequest dto, UserModel user) {

                var project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Projeto não encontrado"));

                var member = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(project.getWorkspace().getId(), user.getId())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.FORBIDDEN, "Você não pertence ao workspace"));

                PermissionService.checkWorkspace(member.getRole(), WorkspacePermission.EDIT_PROJECT);

                project.setName(dto.getName());
                project.setDescription(dto.getDescription());

                return projectRepository.save(project);
        }

        @Transactional
        public void delete(UUID projectId, UserModel user) {

                var project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Projeto não encontrado"));

                var member = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(project.getWorkspace().getId(), user.getId())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.FORBIDDEN, "Você não pertence ao workspace"));

                PermissionService.checkWorkspace(member.getRole(), WorkspacePermission.DELETE_PROJECT);

                projectRepository.delete(project);
        }

        @Transactional(readOnly = true)
        public List<ProjectResponse> findProjectsByWorkspace(UUID workspaceId, UserModel user) {

                var member = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(workspaceId, user.getId())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.FORBIDDEN, "Você não pertence ao workspace"));

                if (member.getRole() == WorkspaceRole.OWNER ||
                                member.getRole() == WorkspaceRole.ADMIN) {

                        var projects = projectRepository.findAllByWorkspaceId(workspaceId);

                        return projects.stream().map(p -> {
                                var role = projectMemberRepository
                                                .findByProject_IdAndUser_Id(p.getId(), user.getId())
                                                .map(pm -> pm.getRole())
                                                .orElse(null);

                                return new ProjectResponse(
                                                p.getId(),
                                                p.getName(),
                                                p.getDescription(),
                                                role);
                        }).toList();
                }

                return projectRepository.findProjectsWithRole(workspaceId, user.getId());
        }

        @Transactional(readOnly = true)
        public List<ProjectResponse> getProjectsByMember(UUID workspaceId, UUID memberId, UserModel loggedUser) {

                var requester = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(workspaceId, loggedUser.getId())
                                .orElseThrow(() -> new RuntimeException("Você não pertence ao workspace"));

                // 🔐 Segurança
                if (requester.getRole() != WorkspaceRole.ADMIN &&
                                requester.getRole() != WorkspaceRole.OWNER) {
                        throw new RuntimeException("Sem permissão");
                }

                var projects = projectRepository.findAllByWorkspaceId(workspaceId);

                return projects.stream().map(project -> {

                        System.out.println("Project: " + project.getId() + " | memberId: " + memberId);

                        var role = projectMemberRepository
                                        .findByProject_IdAndUser_Id(project.getId(), memberId)
                                        .map(pm -> pm.getRole())
                                        .orElse(null);

                        return new ProjectResponse(
                                        project.getId(),
                                        project.getName(),
                                        project.getDescription(),
                                        role);

                }).toList();
        }
}