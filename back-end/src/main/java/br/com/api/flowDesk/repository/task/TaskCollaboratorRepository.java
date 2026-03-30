package br.com.api.flowDesk.repository.task;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.api.flowDesk.model.task.TaskCollaboratorModel;

public interface TaskCollaboratorRepository extends JpaRepository<TaskCollaboratorModel, UUID> {

    Optional<TaskCollaboratorModel> findByTask_IdAndUser_Id(UUID taskId, UUID userId);

    void deleteByTask_IdAndUser_Id(UUID taskId, UUID userId);

    @Query("""
                SELECT c FROM TaskCollaboratorModel c
                JOIN FETCH c.user
                WHERE c.task.id = :taskId
            """)
    List<TaskCollaboratorModel> findByTask_Id(UUID taskId);
}