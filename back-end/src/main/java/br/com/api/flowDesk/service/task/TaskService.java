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
import br.com.api.flowDesk.dto.task.response.TagResponse;
import br.com.api.flowDesk.dto.task.response.TaskResponse;
import br.com.api.flowDesk.dto.taskitem.TaskProgressDTO;
import br.com.api.flowDesk.enums.task.TaskPriority;
import br.com.api.flowDesk.enums.task.TaskStatus;
import br.com.api.flowDesk.model.task.TagModel;
import br.com.api.flowDesk.model.task.TaskModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.task.ProjectRepository;
import br.com.api.flowDesk.repository.task.TagRepository;
import br.com.api.flowDesk.repository.task.TaskItemRepository;
import br.com.api.flowDesk.repository.task.TaskRepository;
import br.com.api.flowDesk.repository.user.UserRepository;

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

    public List<TaskDTO> listByProject(UUID projectId) {
        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> listByWorkspace(UUID workspaceId) {
        return taskRepository.findByProject_Workspace_Id(workspaceId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

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
                .map(tag -> new TagDTO(
                        tag.getId(),
                        tag.getName()))
                .toList();

        return new TaskDTO(
                task.getId(),
                task.getTitle(),
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
                .map(tag -> new TagResponse(
                        tag.getId(),
                        tag.getName()))
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

    @Transactional
    public TaskDTO create(CreateTaskRequest dto, String loggedEmail) {

        var project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto não encontrado"));

        var user = userRepository.findByEmail(loggedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário inválido"));

        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Título é obrigatório");
        }

        var task = new TaskModel();
        task.setProject(project);
        task.setTitle(dto.getTitle().trim());
        task.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);

        task.setPriority(
                dto.getPriority() != null
                        ? dto.getPriority()
                        : TaskPriority.MEDIUM);
        task.setStatus(
                dto.getStatus() != null
                        ? dto.getStatus()
                        : TaskStatus.BACKLOG);

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
                    .anyMatch(l -> !l.getWorkspace().getId().equals(workspaceId));

            if (anyFromOtherWorkspace) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tag de outro workspace não é permitida");
            }

            task.getTags().addAll(tags);
        }

        return toDTO(taskRepository.save(task));
    }

    @Transactional
    public void delete(UUID taskId, UserModel user) {

        TaskModel task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        if (!task.getCreatedBy().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para excluir esta tarefa");
        }

        for (TagModel tag : task.getTags()) {
            tag.getTasks().remove(task);
        }
        task.getTags().clear();

        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public TaskProgressDTO getTaskProgress(UUID taskId) {
        var task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        long total = taskItemRepository.countByTask_Id(taskId);
        long completed = taskItemRepository.countByTask_IdAndDoneTrue(taskId);

        double percentage = 0.0;

        if (total > 0) {
            percentage = ((double) completed / total) * 100.0;
        }

        return new TaskProgressDTO(
                task.getId(),
                total,
                completed,
                percentage);
    }

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(UUID id) {
        TaskModel task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        return toDTO(task);
    }

    @Transactional
    public TaskDTO addTagToTask(UUID taskId, CreateTagRequest tagDto, String userEmail) {
        TaskModel task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        UUID workspaceId = task.getProject().getWorkspace().getId();

        TagDTO tagResult = tagService.create(workspaceId, tagDto, userEmail);

        TagModel tagEntity = tagRepository.findById(tagResult.getId()).orElseThrow();

        task.getTags().add(tagEntity);

        return toDTO(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse removeTag(UUID taskId, UUID tagId) {

        TaskModel task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        TagModel tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag não encontrada"));

        task.getTags().remove(tag);

        tag.getTasks().remove(task);

        taskRepository.save(task);

        return toResponse(task);
    }
}
