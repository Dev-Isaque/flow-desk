package br.com.api.flowDesk.repository.task;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.api.flowDesk.model.task.TagModel;

public interface TagRepository extends JpaRepository<TagModel, UUID> {

    List<TagModel> findByWorkspace_Id(UUID workspaceId);

    Optional<TagModel> findByWorkspaceIdAndNameIgnoreCase(UUID workspaceId, String name);

}
