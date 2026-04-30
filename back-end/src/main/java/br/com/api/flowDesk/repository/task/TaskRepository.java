package br.com.api.flowDesk.repository.task;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.api.flowDesk.model.task.TaskModel;

public interface TaskRepository extends JpaRepository<TaskModel, UUID> {

    List<TaskModel> findByProjectId(UUID projectId);

    List<TaskModel> findByProject_Workspace_Id(UUID workspaceId);

    @Query("""
            SELECT t
            FROM TaskModel t
            WHERE t.dueDateTime IS NOT NULL
              AND t.dueReminderSentAt IS NULL
              AND t.status NOT IN (br.com.api.flowDesk.enums.task.TaskStatus.DONE, br.com.api.flowDesk.enums.task.TaskStatus.CANCELED)
              AND t.dueDateTime BETWEEN :from AND :to
            """)
    List<TaskModel> findTasksDueBetweenForReminder(LocalDateTime from, LocalDateTime to);
}