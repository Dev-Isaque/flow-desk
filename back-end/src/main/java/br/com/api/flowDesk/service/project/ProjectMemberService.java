package br.com.api.flowDesk.service.project;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.api.flowDesk.dto.project.ProjectMemberDTO;
import br.com.api.flowDesk.enums.project.ProjectPermission;
import br.com.api.flowDesk.enums.project.ProjectRole;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.model.project.ProjectMemberModel;
import br.com.api.flowDesk.model.project.ProjectModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.project.ProjectMemberRepository;
import br.com.api.flowDesk.repository.project.ProjectRepository;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.service.permission.PermissionService;

@Service
public class ProjectMemberService {

        @Autowired
        private ProjectMemberRepository projectMemberRepository;

        @Autowired
        private ProjectRepository projectRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private WorkspaceMemberRepository workspaceMemberRepository;

        public List<ProjectMemberDTO> listMembers(UUID projectId) {
                var members = projectMemberRepository.findAllByProject_Id(projectId);

                return members.stream()
                                .map(member -> new ProjectMemberDTO(
                                                member.getId(),
                                                member.getUser().getId(),
                                                member.getUser().getName(),
                                                member.getUser().getEmail(),
                                                member.getRole()))
                                .toList();
        }

        @Transactional
        public void addMember(UUID projectId, UUID memberId, ProjectRole role, UserModel loggedUser) {

                ProjectModel project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

                WorkspaceRole workspaceRole = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(project.getWorkspace().getId(), loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElseThrow(() -> new RuntimeException("Você não pertence ao workspace"));

                ProjectRole projectRole = projectMemberRepository
                                .findByProject_IdAndUser_Id(projectId, loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElse(null);

                PermissionService.checkProject(workspaceRole, projectRole, ProjectPermission.ADD_MEMBER);

                UserModel userToAdd = userRepository.findById(memberId)
                                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

                if (projectMemberRepository.existsByProject_IdAndUser_Id(projectId, userToAdd.getId())) {
                        throw new RuntimeException("Usuário já é membro");
                }

                ProjectMemberModel newMember = new ProjectMemberModel();
                newMember.setProject(project);
                newMember.setUser(userToAdd);
                newMember.setRole(role != null ? role : ProjectRole.VIEWER);

                projectMemberRepository.save(newMember);
        }

        @Transactional
        public void updateMemberRole(UUID projectId, UUID memberId, ProjectRole role, UserModel loggedUser) {

                ProjectMemberModel member = projectMemberRepository
                                .findByProject_IdAndUser_Id(projectId, memberId)
                                .orElseThrow(() -> new RuntimeException("Membro não encontrado"));

                member.setRole(role);

                projectMemberRepository.save(member);
        }

        @Transactional
        public void removeMember(UUID projectId, UUID memberId, UserModel loggedUser) {

                ProjectMemberModel member = projectMemberRepository
                                .findByProject_IdAndUser_Id(projectId, memberId)
                                .orElseThrow(() -> new RuntimeException("Membro não encontrado"));

                ProjectModel project = member.getProject();

                WorkspaceRole workspaceRole = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(project.getWorkspace().getId(), loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElseThrow(() -> new RuntimeException("Você não pertence ao workspace"));

                ProjectRole projectRole = projectMemberRepository
                                .findByProject_IdAndUser_Id(projectId, loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElse(null);

                PermissionService.checkProject(workspaceRole, projectRole, ProjectPermission.REMOVE_MEMBER);

                projectMemberRepository.delete(member);
        }
}