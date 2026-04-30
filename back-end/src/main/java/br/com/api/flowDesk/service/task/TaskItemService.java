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
import br.com.api.flowDesk.enums.project.ProjectRole;
import br.com.api.flowDesk.enums.task.TaskPermission;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.model.task.TaskItemModel;
import br.com.api.flowDesk.model.task.TaskModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.project.ProjectMemberRepository;
import br.com.api.flowDesk.repository.task.TaskItemRepository;
import br.com.api.flowDesk.repository.task.TaskRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.service.permission.PermissionService;

@Service
public class TaskItemService {

    @Autowired
    private TaskItemRepository taskItemRepository;

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;
    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    private TaskItemDTO toDTO(TaskItemModel item) {
        return new TaskItemDTO(
                item.getId(),
                item.getTask().getId(),
                item.getTitle(),
                item.getDone(),
                item.getPosition(),
                item.getCreatedAt());
    }

    private void checkTaskPermission(TaskModel task, UserModel user, TaskPermission permission) {
        WorkspaceRole workspaceRole = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(task.getProject().getWorkspace().getId(), user.getId())
                .map(m -> m.getRole())
                .orElse(null);

        ProjectRole projectRole = projectMemberRepository
                .findByProject_IdAndUser_Id(task.getProject().getId(), user.getId())
                .map(m -> m.getRole())
                .orElse(null);

        PermissionService.checkTaskPermission(workspaceRole, projectRole, task, user, permission);
    }

    public List<TaskItemDTO> listByTask(UUID taskId, UserModel user) {
        var task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
        checkTaskPermission(task, user, TaskPermission.VIEW_TASK);

        return taskItemRepository.findByTask_IdOrderByPositionAscCreatedAtAsc(taskId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public TaskItemDTO create(UUID taskId, CreateTaskItemRequest dto, UserModel user) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Título do item é obrigatório");
        }

        var task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
        checkTaskPermission(task, user, TaskPermission.UPDATE_TASK);

        var item = new TaskItemModel();
        item.setTask(task);
        item.setTitle(dto.getTitle().trim());
        item.setDone(false);
        item.setPosition(dto.getPosition());

        return toDTO(taskItemRepository.save(item));
    }

    @Transactional
    public TaskItemDTO setDone(UUID itemId, Boolean done, UserModel user) {
        if (done == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo done é obrigatório");
        }

        var item = taskItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado"));
        checkTaskPermission(item.getTask(), user, TaskPermission.UPDATE_TASK);

        item.setDone(done);
        return toDTO(taskItemRepository.save(item));
    }

    @Transactional
    public void delete(UUID itemId, UserModel user) {
        var item = taskItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado"));
        checkTaskPermission(item.getTask(), user, TaskPermission.UPDATE_TASK);

        taskItemRepository.delete(item);
    }
}
