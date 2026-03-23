package br.com.api.flowDesk.service.workspace;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.api.flowDesk.dto.workspace.WorkspaceMemberDTO;
import br.com.api.flowDesk.enums.workspace.WorkspacePermission;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.model.workspace.WorkspaceMemberModel;
import br.com.api.flowDesk.model.workspace.WorkspaceModel;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceRepository;
import br.com.api.flowDesk.service.permission.PermissionService;

@Service
public class WorkspaceMemberService {

        @Autowired
        private WorkspaceMemberRepository workspaceMemberRepository;

        @Autowired
        private WorkspaceRepository workspaceRepository;

        @Autowired
        private UserRepository userRepository;

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
        public void updateMember(UUID workspaceId, UUID memberId, WorkspaceRole newRole, UserModel loggedUser) {

                WorkspaceMemberModel loggedMember = getMemberOrThrow(workspaceId, loggedUser.getId());

                PermissionService.checkWorkspace(loggedMember.getRole(), WorkspacePermission.UPDATE_MEMBER_ROLE);

                WorkspaceMemberModel member = workspaceMemberRepository.findById(memberId)
                                .orElseThrow(() -> new RuntimeException("Membro não encontrado"));

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

                WorkspaceMemberModel memberToRemove = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(workspaceId, memberId)
                                .orElseThrow(() -> new RuntimeException("Membro não encontrado neste workspace"));

                if (memberToRemove.getRole() == WorkspaceRole.OWNER) {
                        throw new RuntimeException("Não é permitido remover o OWNER");
                }

                workspaceMemberRepository.delete(memberToRemove);
        }

        @Transactional
        public void leaveWorkspace(UUID workspaceId, UserModel user) {

                WorkspaceMemberModel member = getMemberOrThrow(workspaceId, user.getId());

                if (member.getRole() == WorkspaceRole.OWNER) {
                        throw new RuntimeException("OWNER não pode sair do workspace");
                }

                workspaceMemberRepository.delete(member);
        }

        private WorkspaceMemberModel getMemberOrThrow(UUID workspaceId, UUID userId) {
                return workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(workspaceId, userId)
                                .orElseThrow(() -> new RuntimeException("Você não pertence a esse workspace"));
        }
}