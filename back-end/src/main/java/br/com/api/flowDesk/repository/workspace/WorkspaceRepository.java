package br.com.api.flowDesk.repository.workspace;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.api.flowDesk.enums.workspace.WorkspaceType;
import br.com.api.flowDesk.model.workspace.WorkspaceModel;

public interface WorkspaceRepository extends JpaRepository<WorkspaceModel, UUID> {

  @Query("""
          select w
          from WorkspaceModel w
          join w.members m
          where w.type = :type
            and m.user.id = :userId
      """)
  Optional<WorkspaceModel> findByTypeAndMemberUserId(WorkspaceType type, UUID userId);

  List<WorkspaceModel> findDistinctByMembers_User_IdAndType(
      UUID userId,
      WorkspaceType type);

}