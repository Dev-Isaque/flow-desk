package br.com.api.flowDesk.repository.workspace;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.api.flowDesk.model.task.WorkspaceMemberModel;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMemberModel, UUID> {

    boolean existsByWorkspace_IdAndUser_Id(UUID workspaceId, UUID userId);

    Optional<WorkspaceMemberModel> findByWorkspace_IdAndUser_Id(UUID workspaceId, UUID userId);
}