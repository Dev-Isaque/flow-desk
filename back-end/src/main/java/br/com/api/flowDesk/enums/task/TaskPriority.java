package br.com.api.flowDesk.enums.task;

public enum TaskPriority {
    LOW(1, "Baixa"),
    MEDIUM(2, "Média"),
    HIGH(3, "Alta"),
    URGENT(4, "Urgente");

    private final int level;
    private final String description;

    TaskPriority(int level, String description) {
        this.level = level;
        this.description = description;
    }

    public int getLevel() {
        return level;
    }

    public String getDescription() {
        return description;
    }
}