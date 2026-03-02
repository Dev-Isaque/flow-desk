package br.com.api.flowDesk.enums.task;

public enum TaskStatus {
    BACKLOG("Backlog"),
    TODO("A Fazer"),
    IN_PROGRESS("Em Andamento"),
    BLOCKED("Bloqueada"),
    DONE("Concluída"),
    CANCELED("Cancelada");

    private final String description;

    TaskStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}