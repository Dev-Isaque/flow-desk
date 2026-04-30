package br.com.api.flowDesk.model.workspace;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import br.com.api.flowDesk.enums.workspace.WorkspaceInviteStatus;
import br.com.api.flowDesk.model.user.UserModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "workspace_invitations", indexes = {
        @Index(name = "idx_workspace_invitation_invited_user", columnList = "invited_user_id"),
        @Index(name = "idx_workspace_invitation_workspace", columnList = "workspace_id"),
        @Index(name = "idx_workspace_invitation_status", columnList = "status")
})
@Getter
@Setter
public class WorkspaceInvitationModel {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "workspace_id", nullable = false)
    private WorkspaceModel workspace;

    @ManyToOne
    @JoinColumn(name = "invited_user_id", nullable = false)
    private UserModel invitedUser;

    @ManyToOne
    @JoinColumn(name = "invited_by_id", nullable = false)
    private UserModel invitedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkspaceInviteStatus status = WorkspaceInviteStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;
}
