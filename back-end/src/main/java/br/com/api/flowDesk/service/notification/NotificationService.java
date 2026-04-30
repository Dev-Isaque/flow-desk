package br.com.api.flowDesk.service.notification;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import br.com.api.flowDesk.model.task.TaskCollaboratorModel;
import br.com.api.flowDesk.model.task.TaskModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.model.workspace.WorkspaceModel;

@Service
public class NotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Value("${app.base-url:http://localhost:8080}")
    private String appBaseUrl;

    public void notifyWorkspaceInvite(UUID invitationId, UserModel invitedUser, WorkspaceModel workspace, UserModel invitedBy) {
        String subject = "Convite para workspace: " + workspace.getName();
        String body = "O usuário " + invitedBy.getName() + " convidou você para o workspace \""
                + workspace.getName() + "\".\n\nAcesse: " + appBaseUrl;

        sendEmail(invitedUser.getEmail(), subject, body);

        Map<String, Object> data = new HashMap<>();
        data.put("invitationId", invitationId);
        data.put("workspaceId", workspace.getId());
        data.put("workspaceName", workspace.getName());
        data.put("workspaceColor", workspace.getColor());
        data.put("invitedByName", invitedBy.getName());

        sendInApp(
                invitedUser.getId(),
                "workspace_invite",
                "Você foi convidado para o workspace \"" + workspace.getName() + "\".",
                data);
    }

    public void notifyWorkspaceInviteAccepted(UserModel invitedBy, UserModel acceptedBy, WorkspaceModel workspace) {
        String message = acceptedBy.getName() + " aceitou o convite para o workspace \""
                + workspace.getName() + "\".";

        sendInApp(invitedBy.getId(), "workspace_invite_accepted", message);
    }

    public void notifyTaskOwnershipTransferred(TaskModel task, UserModel newOwner, UserModel previousOwner,
            UserModel assignedBy) {
        String newOwnerMessage = "Você agora é responsável pela tarefa \"" + task.getTitle() + "\".";
        sendInApp(newOwner.getId(), "task_owner_transferred", newOwnerMessage);
        sendEmail(newOwner.getEmail(), "Responsabilidade transferida: " + task.getTitle(), newOwnerMessage);

        if (previousOwner != null && !previousOwner.getId().equals(newOwner.getId())) {
            String previousOwnerMessage = assignedBy.getName() + " transferiu a responsabilidade da tarefa \""
                    + task.getTitle() + "\" para " + newOwner.getName() + ".";
            sendInApp(previousOwner.getId(), "task_owner_transferred", previousOwnerMessage);
        }
    }

    public void notifyTaskCreated(TaskModel task, UserModel actor, List<UserModel> recipients) {
        for (UserModel recipient : recipients) {
            if (recipient.getId().equals(actor.getId())) {
                continue;
            }
            String message = actor.getName() + " criou a tarefa \"" + task.getTitle() + "\" no projeto \""
                    + task.getProject().getName() + "\".";

            sendInApp(recipient.getId(), "task_created", message);
            sendEmail(recipient.getEmail(), "Nova tarefa criada: " + task.getTitle(), message);
        }
    }

    public void notifyTaskAssigned(TaskModel task, UserModel assignedUser, UserModel assignedBy) {
        String message = "Você foi atribuído à tarefa \"" + task.getTitle() + "\" por "
                + assignedBy.getName() + ".";

        sendInApp(assignedUser.getId(), "task_assigned", message);
        sendEmail(assignedUser.getEmail(), "Tarefa atribuída: " + task.getTitle(), message);
    }

    public void notifyTaskDueSoon(TaskModel task, List<TaskCollaboratorModel> collaborators) {
        LocalDateTime dueDate = task.getDueDateTime();
        if (dueDate == null) {
            return;
        }

        long minutesLeft = Math.max(0, Duration.between(LocalDateTime.now(), dueDate).toMinutes());
        String message = "A tarefa \"" + task.getTitle() + "\" vence em aproximadamente "
                + minutesLeft + " minuto(s).";

        for (TaskCollaboratorModel collaborator : collaborators) {
            UserModel user = collaborator.getUser();
            sendInApp(user.getId(), "task_due_soon", message);
            sendEmail(user.getEmail(), "Prazo da tarefa: " + task.getTitle(), message);
        }
    }

    private void sendInApp(UUID userId, String type, String message) {
        sendInApp(userId, type, message, Map.of());
    }

    private void sendInApp(UUID userId, String type, String message, Map<String, Object> data) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", type);
        payload.put("message", message);
        payload.put("createdAt", LocalDateTime.now());
        payload.putAll(data);

        messagingTemplate.convertAndSend("/topic/users/" + userId + "/notifications", (Object) payload);
    }

    private void sendEmail(String to, String subject, String text) {
        if (mailSender == null) {
            LOGGER.warn("JavaMailSender indisponível. E-mail não enviado para {}", to);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception ex) {
            LOGGER.warn("Falha ao enviar e-mail para {}: {}", to, ex.getMessage());
        }
    }
}
