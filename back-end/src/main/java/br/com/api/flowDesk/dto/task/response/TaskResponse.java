package br.com.api.flowDesk.dto.task.response;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import br.com.api.flowDesk.enums.task.TaskPriority;
import br.com.api.flowDesk.enums.task.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TaskResponse {

    private UUID id;

    private String title;

    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    private LocalDateTime dueDateTime;

    private UUID workspaceId;

    private String createdByName;

    private Set<TagResponse> tags;
}