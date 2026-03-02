package br.com.api.flowDesk.dto.task.request;

import br.com.api.flowDesk.enums.task.TaskStatus;

public class StatusTaskRequest {
    private TaskStatus status;

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
