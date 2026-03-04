package br.com.api.flowDesk.model.task;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import br.com.api.flowDesk.enums.workspace.WorkspaceType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "workspaces")
@Getter
@Setter
public class WorkspaceModel {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String name;
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkspaceType type;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "workspace")
    private List<ProjectModel> projects;

    @OneToMany(mappedBy = "workspace")
    private List<TagModel> tags;

    @OneToMany(mappedBy = "workspace")
    private List<WorkspaceMemberModel> members;
}
