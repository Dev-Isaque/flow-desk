package br.com.api.flowDesk.service.workspace;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.api.flowDesk.dto.workspace.dto.WorkspaceMemberDTO;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.model.task.WorkspaceMemberModel;
import br.com.api.flowDesk.model.task.WorkspaceModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceRepository;

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
                                                member.getUser().getName(),
                                                member.getUser().getEmail(),
                                                member.getRole()))
                                .toList();
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
        public void updateMember(UUID workspaceId, UUID memberId, WorkspaceRole newRole, UserModel loggedUser) {

                WorkspaceMemberModel loggedMember = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(workspaceId, loggedUser.getId())
                                .orElseThrow(() -> new RuntimeException("Você não pertence a esse workspace"));

                if (loggedMember.getRole() == WorkspaceRole.MEMBER ||
                                loggedMember.getRole() == WorkspaceRole.VIEWER) {
                        throw new RuntimeException("Sem permissão para alterar permissões");
                }

                WorkspaceMemberModel member = workspaceMemberRepository
                                .findById(memberId)
                                .orElseThrow(() -> new RuntimeException("Membro não encontrado"));

                member.setRole(newRole);

                workspaceMemberRepository.save(member);
        }

        @Transactional
        public void removedMember(UUID workspaceId, UUID memberId, UserModel loggedUser) {

                WorkspaceModel workspace = workspaceRepository.findById(workspaceId)
                                .orElseThrow(() -> new RuntimeException("Workspace não encontrado"));

                WorkspaceMemberModel workspaceMember = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(workspaceId, memberId)
                                .orElseThrow(() -> new RuntimeException("Membro não encontrado neste workspace"));

                workspaceMemberRepository.delete(workspaceMember);
        }
}
