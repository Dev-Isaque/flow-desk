package br.com.api.flowDesk.model.task;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import br.com.api.flowDesk.model.workspace.WorkspaceModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tags", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "workspace_id", "name" })
})
@Getter
@Setter
public class TagModel {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "workspace_id", nullable = false)
    private WorkspaceModel workspace;

    @Column(nullable = false)
    private String name;

    @Column(length = 20)
    private String color;

    @ManyToMany(mappedBy = "tags")
    private Set<TaskModel> tasks = new HashSet<>();
}