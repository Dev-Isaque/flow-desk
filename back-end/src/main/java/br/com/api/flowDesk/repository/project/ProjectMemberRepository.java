package br.com.api.flowDesk.repository.project;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.api.flowDesk.model.project.ProjectMemberModel;

public interface ProjectMemberRepository extends JpaRepository<ProjectMemberModel, UUID> {

    boolean existsByProject_IdAndUser_Id(UUID projectId, UUID userId);

    Optional<ProjectMemberModel> findByProject_IdAndUser_Id(UUID projectId, UUID userId);

    List<ProjectMemberModel> findAllByProject_Id(UUID projectId);

    void deleteByProject_IdAndUser_Id(UUID projectId, UUID userId);

    void deleteByProject_Workspace_IdAndUser_Id(UUID workspaceId, UUID userId);

    long countByProject_Id(UUID projectId);

}
