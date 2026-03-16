package br.com.api.flowDesk.repository.task;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.api.flowDesk.model.task.TaskModel;

public interface TaskRepository extends JpaRepository<TaskModel, UUID> {

    List<TaskModel> findByProjectId(UUID projectId);

    List<TaskModel> findByProject_Workspace_Id(UUID workspaceId);
}