package br.com.api.flowDesk.repository.workspace;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.api.flowDesk.enums.workspace.WorkspaceInviteStatus;
import br.com.api.flowDesk.model.workspace.WorkspaceInvitationModel;

public interface WorkspaceInvitationRepository extends JpaRepository<WorkspaceInvitationModel, UUID> {

    boolean existsByWorkspace_IdAndInvitedUser_IdAndStatus(
            UUID workspaceId,
            UUID invitedUserId,
            WorkspaceInviteStatus status);

    Optional<WorkspaceInvitationModel> findByWorkspace_IdAndInvitedUser_IdAndStatus(
            UUID workspaceId,
            UUID invitedUserId,
            WorkspaceInviteStatus status);

    Optional<WorkspaceInvitationModel> findByIdAndInvitedUser_Id(UUID invitationId, UUID invitedUserId);

    List<WorkspaceInvitationModel> findAllByInvitedUser_IdAndStatusOrderByCreatedAtDesc(
            UUID invitedUserId,
            WorkspaceInviteStatus status);

    void deleteByWorkspace_Id(UUID workspaceId);
}
