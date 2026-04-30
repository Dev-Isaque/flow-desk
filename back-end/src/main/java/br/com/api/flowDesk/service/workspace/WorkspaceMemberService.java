package br.com.api.flowDesk.service.workspace;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.api.flowDesk.dto.workspace.WorkspaceMemberDTO;
import br.com.api.flowDesk.dto.workspace.WorkspaceInvitationDTO;
import br.com.api.flowDesk.enums.workspace.WorkspaceInviteStatus;
import br.com.api.flowDesk.enums.workspace.WorkspacePermission;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.model.workspace.WorkspaceInvitationModel;
import br.com.api.flowDesk.model.workspace.WorkspaceMemberModel;
import br.com.api.flowDesk.model.workspace.WorkspaceModel;
import br.com.api.flowDesk.repository.project.ProjectMemberRepository;
import br.com.api.flowDesk.repository.task.TaskCollaboratorRepository;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceInvitationRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceRepository;
import br.com.api.flowDesk.service.notification.NotificationService;
import br.com.api.flowDesk.service.permission.PermissionService;

@Service
public class WorkspaceMemberService {

        @Autowired
        private WorkspaceMemberRepository workspaceMemberRepository;

        @Autowired
        private WorkspaceInvitationRepository workspaceInvitationRepository;

        @Autowired
        private WorkspaceRepository workspaceRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private ProjectMemberRepository projectMemberRepository;

        @Autowired
        private TaskCollaboratorRepository taskCollaboratorRepository;

        @Autowired
        private NotificationService notificationService;

        public List<WorkspaceMemberDTO> listMembers(UUID workspaceId) {

                var members = workspaceMemberRepository.findAllByWorkspace_Id(workspaceId);

                return members.stream()
                                .map(member -> new WorkspaceMemberDTO(
                                                member.getId(),
                                                member.getUser().getId(),
                                                member.getUser().getName(),
                                                member.getUser().getEmail(),
                                                member.getRole()))
                                .toList();
        }

        @Transactional
        public void addMember(UUID workspaceId, String emailToAdd, UserModel loggedUser) {

                WorkspaceModel workspace = workspaceRepository.findById(workspaceId)
                                .orElseThrow(() -> new RuntimeException("Workspace não encontrado"));

                WorkspaceMemberModel loggedMember = getMemberOrThrow(workspaceId, loggedUser.getId());

                PermissionService.checkWorkspace(loggedMember.getRole(), WorkspacePermission.ADD_MEMBER);

                UserModel userToAdd = userRepository.findByEmail(emailToAdd)
                                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

                if (userToAdd.getId().equals(loggedUser.getId())) {
                        throw new RuntimeException("Você já pertence a esse workspace");
                }

                if (workspaceMemberRepository.existsByWorkspace_IdAndUser_Id(workspaceId, userToAdd.getId())) {
                        throw new RuntimeException("Usuário já é membro");
                }

                if (workspaceInvitationRepository.existsByWorkspace_IdAndInvitedUser_IdAndStatus(
                                workspaceId,
                                userToAdd.getId(),
                                WorkspaceInviteStatus.PENDING)) {
                        throw new RuntimeException("Já existe um convite pendente para esse usuário");
                }

                WorkspaceInvitationModel invitation = new WorkspaceInvitationModel();
                invitation.setWorkspace(workspace);
                invitation.setInvitedUser(userToAdd);
                invitation.setInvitedBy(loggedUser);
                invitation.setStatus(WorkspaceInviteStatus.PENDING);

                invitation = workspaceInvitationRepository.save(invitation);
                notificationService.notifyWorkspaceInvite(invitation.getId(), userToAdd, workspace, loggedUser);
        }

        public List<WorkspaceInvitationDTO> listPendingInvitations(UserModel user) {
                return workspaceInvitationRepository
                                .findAllByInvitedUser_IdAndStatusOrderByCreatedAtDesc(
                                                user.getId(),
                                                WorkspaceInviteStatus.PENDING)
                                .stream()
                                .map(this::toInvitationDTO)
                                .toList();
        }

        @Transactional
        public WorkspaceInvitationDTO acceptInvitation(UUID invitationId, UserModel user) {
                WorkspaceInvitationModel invitation = getInvitationForUserOrThrow(invitationId, user);

                if (!workspaceMemberRepository.existsByWorkspace_IdAndUser_Id(
                                invitation.getWorkspace().getId(),
                                user.getId())) {
                        WorkspaceMemberModel member = new WorkspaceMemberModel();
                        member.setWorkspace(invitation.getWorkspace());
                        member.setUser(user);
                        member.setRole(WorkspaceRole.MEMBER);
                        workspaceMemberRepository.save(member);
                }

                invitation.setStatus(WorkspaceInviteStatus.ACCEPTED);
                invitation.setRespondedAt(LocalDateTime.now());

                workspaceInvitationRepository.save(invitation);
                notificationService.notifyWorkspaceInviteAccepted(
                                invitation.getInvitedBy(),
                                user,
                                invitation.getWorkspace());

                return toInvitationDTO(invitation);
        }

        @Transactional
        public WorkspaceInvitationDTO declineInvitation(UUID invitationId, UserModel user) {
                WorkspaceInvitationModel invitation = getInvitationForUserOrThrow(invitationId, user);

                invitation.setStatus(WorkspaceInviteStatus.DECLINED);
                invitation.setRespondedAt(LocalDateTime.now());

                return toInvitationDTO(workspaceInvitationRepository.save(invitation));
        }

        @Transactional
        public void updateMember(UUID workspaceId, UUID memberId, WorkspaceRole newRole, UserModel loggedUser) {

                WorkspaceMemberModel loggedMember = getMemberOrThrow(workspaceId, loggedUser.getId());

                PermissionService.checkWorkspace(loggedMember.getRole(), WorkspacePermission.UPDATE_MEMBER_ROLE);

                WorkspaceMemberModel member = getMembershipByIdOrThrow(workspaceId, memberId);
                if (newRole == null || newRole == WorkspaceRole.OWNER) {
                        throw new RuntimeException("Função inválida para o membro");
                }

                if (member.getRole() == WorkspaceRole.OWNER) {
                        throw new RuntimeException("Não é permitido alterar o OWNER");
                }

                member.setRole(newRole);

                workspaceMemberRepository.save(member);
        }

        @Transactional
        public void removedMember(UUID workspaceId, UUID memberId, UserModel loggedUser) {

                WorkspaceMemberModel loggedMember = getMemberOrThrow(workspaceId, loggedUser.getId());

                PermissionService.checkWorkspace(loggedMember.getRole(), WorkspacePermission.REMOVE_MEMBER);

                WorkspaceMemberModel memberToRemove = getMembershipByIdOrThrow(workspaceId, memberId);

                if (memberToRemove.getRole() == WorkspaceRole.OWNER) {
                        throw new RuntimeException("Não é permitido remover o OWNER");
                }

                cleanupMemberReferences(workspaceId, memberToRemove.getUser().getId());
                workspaceMemberRepository.delete(memberToRemove);
        }

        @Transactional
        public void leaveWorkspace(UUID workspaceId, UserModel user) {

                WorkspaceMemberModel member = getMemberOrThrow(workspaceId, user.getId());

                if (member.getRole() == WorkspaceRole.OWNER) {
                        throw new RuntimeException("OWNER não pode sair do workspace");
                }

                cleanupMemberReferences(workspaceId, user.getId());
                workspaceMemberRepository.delete(member);
        }

        private void cleanupMemberReferences(UUID workspaceId, UUID userId) {
                taskCollaboratorRepository.deleteByTask_Project_Workspace_IdAndUser_Id(workspaceId, userId);
                projectMemberRepository.deleteByProject_Workspace_IdAndUser_Id(workspaceId, userId);
        }

        private WorkspaceMemberModel getMemberOrThrow(UUID workspaceId, UUID userId) {
                return workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(workspaceId, userId)
                                .orElseThrow(() -> new RuntimeException("Você não pertence a esse workspace"));
        }

        private WorkspaceMemberModel getMembershipByIdOrThrow(UUID workspaceId, UUID memberId) {
                return workspaceMemberRepository
                                .findByIdAndWorkspace_Id(memberId, workspaceId)
                                .orElseThrow(() -> new RuntimeException("Membro não encontrado neste workspace"));
        }

        private WorkspaceInvitationModel getInvitationForUserOrThrow(UUID invitationId, UserModel user) {
                WorkspaceInvitationModel invitation = workspaceInvitationRepository
                                .findByIdAndInvitedUser_Id(invitationId, user.getId())
                                .orElseThrow(() -> new RuntimeException("Convite não encontrado"));

                if (invitation.getStatus() != WorkspaceInviteStatus.PENDING) {
                        throw new RuntimeException("Convite já respondido");
                }

                return invitation;
        }

        private WorkspaceInvitationDTO toInvitationDTO(WorkspaceInvitationModel invitation) {
                return new WorkspaceInvitationDTO(
                                invitation.getId(),
                                invitation.getWorkspace().getId(),
                                invitation.getWorkspace().getName(),
                                invitation.getWorkspace().getColor(),
                                invitation.getInvitedBy().getName(),
                                invitation.getCreatedAt(),
                                invitation.getStatus());
        }
}
