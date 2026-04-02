package br.com.api.flowDesk.dto.task;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.com.api.flowDesk.enums.task.TaskPriority;
import br.com.api.flowDesk.enums.task.TaskRole;
import br.com.api.flowDesk.enums.task.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TaskDTO {

    private UUID id;
    private String title;
    private String description;

    private TaskStatus status;
    private TaskPriority priority;

    private LocalDateTime dueDateTime;
    private String estimatedTime;

    private UUID projectId;
    private UUID workspaceId;
    private UUID createdById;

    private String createdByName;

    private LocalDateTime createdAt;
    private List<TagDTO> tags;

    private TaskRole currentUserRole;

    private boolean canEdit;
    private boolean canDelete;
    private boolean canComment;
    private boolean canAddAttachment;
    private boolean canManageCollaborators;

    @JsonProperty("statusDescription")
    public String getStatusDescription() {
        return status != null ? status.getDescription() : null;
    }

    @JsonProperty("priorityDescription")
    public String getPriorityDescription() {
        return priority != null ? priority.getDescription() : null;
    }
}