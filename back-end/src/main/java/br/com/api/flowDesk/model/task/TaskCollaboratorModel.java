package br.com.api.flowDesk.model.task;

import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import br.com.api.flowDesk.enums.task.TaskRole;
import br.com.api.flowDesk.model.user.UserModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "task_collaborators", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "task_id", "user_id" })
})
@Getter
@Setter
public class TaskCollaboratorModel {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private TaskModel task;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskRole role;
}
