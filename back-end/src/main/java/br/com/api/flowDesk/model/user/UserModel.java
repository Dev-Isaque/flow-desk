package br.com.api.flowDesk.model.user;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import br.com.api.flowDesk.model.project.ProjectMemberModel;
import br.com.api.flowDesk.model.workspace.WorkspaceMemberModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class UserModel {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    private String code;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    @UpdateTimestamp
    private LocalDate updatedAt;

    @OneToMany(mappedBy = "user")
    private List<WorkspaceMemberModel> workspaceMemberships;

    @OneToMany(mappedBy = "user")
    private List<ProjectMemberModel> projectMemberships;
}
