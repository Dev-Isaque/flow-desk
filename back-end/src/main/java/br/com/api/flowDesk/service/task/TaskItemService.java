package br.com.api.flowDesk.service.task;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.api.flowDesk.dto.taskitem.TaskItemDTO;
import br.com.api.flowDesk.dto.taskitem.request.CreateTaskItemRequest;
import br.com.api.flowDesk.model.task.TaskItemModel;
import br.com.api.flowDesk.repository.task.TaskItemRepository;
import br.com.api.flowDesk.repository.task.TaskRepository;

@Service
public class TaskItemService {

    @Autowired
    private TaskItemRepository taskItemRepository;

    @Autowired
    private TaskRepository taskRepository;

    private TaskItemDTO toDTO(TaskItemModel item) {
        return new TaskItemDTO(
                item.getId(),
                item.getTask().getId(),
                item.getTitle(),
                item.getDone(),
                item.getPosition(),
                item.getCreatedAt());
    }

    public List<TaskItemDTO> listByTask(UUID taskId) {
        return taskItemRepository.findByTask_IdOrderByPositionAscCreatedAtAsc(taskId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public TaskItemDTO create(UUID taskId, CreateTaskItemRequest dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Título do item é obrigatório");
        }

        var task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        var item = new TaskItemModel();
        item.setTask(task);
        item.setTitle(dto.getTitle().trim());
        item.setDone(false);
        item.setPosition(dto.getPosition());

        return toDTO(taskItemRepository.save(item));
    }

    @Transactional
    public TaskItemDTO setDone(UUID itemId, Boolean done) {
        if (done == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo done é obrigatório");
        }

        var item = taskItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado"));

        item.setDone(done);
        return toDTO(taskItemRepository.save(item));
    }

    @Transactional
    public void delete(UUID itemId) {
        var item = taskItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado"));

        taskItemRepository.delete(item);
    }
}
