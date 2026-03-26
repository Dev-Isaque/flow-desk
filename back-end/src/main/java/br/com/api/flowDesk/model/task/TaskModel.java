package br.com.api.flowDesk.model.task;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import br.com.api.flowDesk.enums.task.TaskPriority;
import br.com.api.flowDesk.enums.task.TaskStatus;
import br.com.api.flowDesk.model.project.ProjectModel;
import br.com.api.flowDesk.model.user.UserModel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tasks", indexes = {
        @Index(name = "idx_task_project", columnList = "project_id"),
        @Index(name = "idx_task_assigned", columnList = "assigned_to"),
        @Index(name = "idx_task_created_by", columnList = "created_by")
})
@Getter
@Setter
public class TaskModel {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectModel project;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    private TaskPriority priority;

    @Column(name = "due_date_time")
    private LocalDateTime dueDateTime;

    @Column(name = "estimated_time_seconds")
    private Long estimatedTimeSeconds;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private UserModel createdBy;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskCollaboratorModel> collaborators = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommentModel> comments = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(name = "task_tags", joinColumns = @JoinColumn(name = "task_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<TagModel> tags = new HashSet<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskItemModel> items = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttachmentModel> attachments = new ArrayList<>();

    public Duration getEstimatedTime() {
        return estimatedTimeSeconds != null ? Duration.ofSeconds(estimatedTimeSeconds) : null;
    }

    public void setEstimatedTime(Duration duration) {
        this.estimatedTimeSeconds = (duration != null) ? duration.getSeconds() : null;
    }
}
