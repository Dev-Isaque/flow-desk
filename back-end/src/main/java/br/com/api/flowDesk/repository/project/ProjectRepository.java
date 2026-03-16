package br.com.api.flowDesk.repository.project;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import br.com.api.flowDesk.model.project.ProjectModel;

public interface ProjectRepository extends JpaRepository<ProjectModel, UUID> {

  @Query("""
        select distinct p
        from ProjectModel p
        join p.workspace w
        join w.members m
        where m.user.id = :userId
        order by p.createdAt desc
      """)
  List<ProjectModel> findProjectsByUser(UUID userId);

  @Query("""
        select distinct p
        from ProjectModel p
        join p.workspace w
        join w.members m
        where w.id = :workspaceId
          and m.user.id = :userId
        order by p.createdAt desc
      """)
  List<ProjectModel> findProjectsByWorkspaceAndUser(UUID workspaceId, UUID userId);

  @Modifying
  @Query("DELETE FROM ProjectModel p WHERE p.workspace.id = :workspaceId")
  void deleteByWorkspaceId(UUID workspaceId);

}
