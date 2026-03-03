package br.com.api.flowDesk.repository.task;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.api.flowDesk.model.task.AttachmentModel;
import br.com.api.flowDesk.model.task.TaskModel;

public interface AttachmentRepository extends JpaRepository<AttachmentModel, UUID> {

    List<AttachmentModel> findByTask(TaskModel task);

    List<AttachmentModel> findByTaskId(UUID taskId);
}
