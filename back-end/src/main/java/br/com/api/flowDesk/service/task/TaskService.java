package br.com.api.flowDesk.service.task;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.api.flowDesk.dto.task.TagDTO;
import br.com.api.flowDesk.dto.task.TaskDTO;
import br.com.api.flowDesk.dto.task.request.CreateTagRequest;
import br.com.api.flowDesk.dto.task.request.CreateTaskRequest;
import br.com.api.flowDesk.dto.task.request.UpdateTaskRequest;
import br.com.api.flowDesk.dto.task.response.TagResponse;
import br.com.api.flowDesk.dto.task.response.TaskResponse;
import br.com.api.flowDesk.dto.taskitem.TaskProgressDTO;
import br.com.api.flowDesk.enums.project.ProjectRole;
import br.com.api.flowDesk.enums.task.TaskPermission;
import br.com.api.flowDesk.enums.task.TaskPriority;
import br.com.api.flowDesk.enums.task.TaskRole;
import br.com.api.flowDesk.enums.task.TaskStatus;
import br.com.api.flowDesk.enums.workspace.WorkspaceRole;
import br.com.api.flowDesk.model.task.TagModel;
import br.com.api.flowDesk.model.task.TaskCollaboratorModel;
import br.com.api.flowDesk.model.task.TaskModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.project.ProjectMemberRepository;
import br.com.api.flowDesk.repository.project.ProjectRepository;
import br.com.api.flowDesk.repository.task.TagRepository;
import br.com.api.flowDesk.repository.task.TaskCollaboratorRepository;
import br.com.api.flowDesk.repository.task.TaskItemRepository;
import br.com.api.flowDesk.repository.task.TaskRepository;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.service.permission.PermissionService;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private TaskItemRepository taskItemRepository;
    @Autowired
    private TagService tagService;
    @Autowired
    private AttachmentService attachmentService;
    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;
    @Autowired
    private TaskCollaboratorRepository taskCollaboratorRepository;
    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    private String formatEstimatedTime(Long seconds) {
        if (seconds == null)
            return null;
        long mm = seconds / 60;
        long ss = seconds % 60;
        return String.format("%d:%02d", mm, ss);
    }

    private Long parseEstimatedTime(String value) {
        if (value == null || value.isBlank())
            return null;

        var parts = value.split(":");
        long mm = Long.parseLong(parts[0]);
        long ss = Long.parseLong(parts[1]);

        return (mm * 60) + ss;
    }

    private TaskDTO toDTO(TaskModel task) {
        var tagDTOs = task.getTags()
                .stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName(), tag.getColor(), 0))
                .toList();

        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDateTime(),
                formatEstimatedTime(task.getEstimatedTimeSeconds()),
                task.getProject().getId(),
                task.getProject().getWorkspace().getId(),
                task.getCreatedBy().getId(),
                task.getCreatedBy().getName(),
                task.getCreatedAt(),
                tagDTOs);
    }

    private TaskResponse toResponse(TaskModel task) {
        Set<TagResponse> tagResponses = task.getTags()
                .stream()
                .map(tag -> new TagResponse(tag.getId(), tag.getName()))
                .collect(Collectors.toSet());

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDateTime(),
                task.getProject().getWorkspace().getId(),
                task.getCreatedBy().getName(),
                tagResponses);
    }

    private WorkspaceRole getWorkspaceRole(UUID workspaceId, UUID userId) {
        return workspaceMemberRepository.findByWorkspace_IdAndUser_Id(workspaceId, userId)
                .map(m -> m.getRole())
                .orElse(null);
    }

    private ProjectRole getProjectRole(UUID projectId, UUID userId) {
        return projectMemberRepository.findByProject_IdAndUser_Id(projectId, userId)
                .map(m -> m.getRole())
                .orElse(null);
    }

    private void checkPermission(TaskModel task, UserModel user, TaskPermission permission) {
        WorkspaceRole workspaceRole = getWorkspaceRole(task.getProject().getWorkspace().getId(), user.getId());
        ProjectRole projectRole = getProjectRole(task.getProject().getId(), user.getId());
        PermissionService.checkTaskPermission(workspaceRole, projectRole, task, user, permission);
    }

    @Transactional
    public TaskDTO create(CreateTaskRequest dto, UserModel user) {
        var project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto não encontrado"));

        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Título é obrigatório");
        }

        var task = new TaskModel();
        task.setProject(project);
        task.setTitle(dto.getTitle().trim());
        task.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : TaskPriority.MEDIUM);
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : TaskStatus.BACKLOG);
        task.setDueDateTime(dto.getDueDateTime());
        task.setEstimatedTimeSeconds(parseEstimatedTime(dto.getEstimatedTime()));
        task.setCreatedBy(user);

        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            var tags = tagRepository.findAllById(dto.getTagIds());
            if (tags.size() != dto.getTagIds().size()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Uma ou mais tags não existem");
            }

            var workspaceId = project.getWorkspace().getId();
            boolean anyFromOtherWorkspace = tags.stream()
                    .anyMatch(t -> !t.getWorkspace().getId().equals(workspaceId));
            if (anyFromOtherWorkspace) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag de outro workspace não é permitida");
            }

            task.getTags().addAll(tags);
        }

        task = taskRepository.save(task);

        TaskCollaboratorModel owner = new TaskCollaboratorModel();
        owner.setTask(task);
        owner.setUser(user);
        owner.setRole(TaskRole.OWNER);
        taskCollaboratorRepository.save(owner);

        return toDTO(task);
    }

    @Transactional
    public TaskDTO update(UUID taskId, UpdateTaskRequest dto, UserModel user) {
        var task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        checkPermission(task, user, TaskPermission.UPDATE_TASK);

        if (dto.getTitle() != null && !dto.getTitle().trim().isEmpty()) {
            task.setTitle(dto.getTitle().trim());
        }
        if (dto.getDescription() != null) {
            task.setDescription(dto.getDescription().trim());
        }
        if (dto.getPriority() != null) {
            task.setPriority(dto.getPriority());
        }
        if (dto.getStatus() != null) {
            task.setStatus(dto.getStatus());
        }
        if (dto.getDueDateTime() != null) {
            task.setDueDateTime(dto.getDueDateTime());
        }
        if (dto.getEstimatedTime() != null) {
            task.setEstimatedTimeSeconds(parseEstimatedTime(dto.getEstimatedTime()));
        }

        return toDTO(taskRepository.save(task));
    }

    @Transactional
    public void delete(UUID taskId, UserModel user) {
        TaskModel task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        checkPermission(task, user, TaskPermission.DELETE_TASK);

        var attachments = attachmentService.findByTask(taskId);
        for (var attachment : attachments) {
            attachmentService.delete(attachment.getId());
        }

        taskRepository.delete(task);
    }

    @Transactional
    public TaskDTO updateStatus(UUID taskId, TaskStatus newStatus, UserModel user) {
        TaskModel task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        checkPermission(task, user, TaskPermission.UPDATE_TASK);

        task.setStatus(newStatus);
        return toDTO(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public TaskProgressDTO getTaskProgress(UUID taskId) {
        var task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        long total = taskItemRepository.countByTask_Id(taskId);
        long completed = taskItemRepository.countByTask_IdAndDoneTrue(taskId);
        double percentage = total > 0 ? ((double) completed / total) * 100.0 : 0.0;

        return new TaskProgressDTO(task.getId(), total, completed, percentage);
    }

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(UUID id) {
        TaskModel task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        return toDTO(task);
    }

    @Transactional
    public TaskDTO addTagToTask(UUID taskId, CreateTagRequest tagDto, UserModel user) {
        TaskModel task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        checkPermission(task, user, TaskPermission.UPDATE_TASK);

        UUID workspaceId = task.getProject().getWorkspace().getId();
        TagDTO tagResult = tagService.create(workspaceId, tagDto);
        TagModel tagEntity = tagRepository.findById(tagResult.getId()).orElseThrow();

        task.getTags().add(tagEntity);
        return toDTO(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse removeTag(UUID taskId, UUID tagId, UserModel user) {
        TaskModel task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        checkPermission(task, user, TaskPermission.UPDATE_TASK);

        TagModel tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag não encontrada"));

        task.getTags().remove(tag);
        tag.getTasks().remove(task);

        taskRepository.save(task);

        return toResponse(task);
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> listByProject(UUID projectId, UserModel user) {

        var project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto não encontrado"));

        WorkspaceRole workspaceRole = getWorkspaceRole(project.getWorkspace().getId(), user.getId());
        ProjectRole projectRole = getProjectRole(projectId, user.getId());

        return taskRepository.findByProjectId(projectId)
                .stream()
                .filter(task -> PermissionService.canViewTask(
                        workspaceRole,
                        projectRole,
                        task,
                        user))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> listByWorkspace(UUID workspaceId, UserModel user) {

        WorkspaceRole workspaceRole = getWorkspaceRole(workspaceId, user.getId());

        return taskRepository.findByProject_Workspace_Id(workspaceId)
                .stream()
                .filter(task -> {

                    ProjectRole projectRole = getProjectRole(
                            task.getProject().getId(),
                            user.getId());

                    return PermissionService.canViewTask(
                            workspaceRole,
                            projectRole,
                            task,
                            user);
                })
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

}