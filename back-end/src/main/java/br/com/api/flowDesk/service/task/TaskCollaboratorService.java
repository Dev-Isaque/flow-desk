package br.com.api.flowDesk.service.task;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.api.flowDesk.dto.task.response.TaskCollaboratorResponseDTO;
import br.com.api.flowDesk.enums.task.TaskPermission;
import br.com.api.flowDesk.enums.task.TaskRole;
import br.com.api.flowDesk.model.task.TaskCollaboratorModel;
import br.com.api.flowDesk.model.task.TaskModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.project.ProjectMemberRepository;
import br.com.api.flowDesk.repository.task.TaskCollaboratorRepository;
import br.com.api.flowDesk.repository.task.TaskRepository;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.service.notification.NotificationService;
import br.com.api.flowDesk.service.permission.PermissionService;

@Service
public class TaskCollaboratorService {

        @Autowired
        private TaskRepository taskRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private TaskCollaboratorRepository taskMemberRepository;

        @Autowired
        private WorkspaceMemberRepository workspaceMemberRepository;

        @Autowired
        private ProjectMemberRepository projectMemberRepository;
        @Autowired
        private NotificationService notificationService;

        @Transactional
        public void addCollaborator(UUID taskId, UUID userId, TaskRole role, UserModel loggedUser) {

                TaskModel task = taskRepository.findById(taskId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Tarefa não encontrada"));

                var workspaceRole = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(
                                                task.getProject().getWorkspace().getId(),
                                                loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElse(null);

                var projectRole = projectMemberRepository
                                .findByProject_IdAndUser_Id(
                                                task.getProject().getId(),
                                                loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElse(null);

                PermissionService.checkTaskPermission(
                                workspaceRole,
                                projectRole,
                                task,
                                loggedUser,
                                TaskPermission.ADD_COLLABORATOR);

                UserModel user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Usuário não encontrado"));

                var existing = taskMemberRepository.findByTask_IdAndUser_Id(taskId, userId);

                if (existing.isPresent()) {
                        existing.get().setRole(role);
                        notificationService.notifyTaskAssigned(task, user, loggedUser);
                        return;
                }

                TaskCollaboratorModel collaborator = new TaskCollaboratorModel();
                collaborator.setTask(task);
                collaborator.setUser(user);
                collaborator.setRole(role);

                taskMemberRepository.save(collaborator);
                notificationService.notifyTaskAssigned(task, user, loggedUser);
        }

        @Transactional
        public void removeCollaborator(UUID taskId, UUID userId, UserModel loggedUser) {

                TaskModel task = taskRepository.findById(taskId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Tarefa não encontrada"));

                var workspaceRole = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(
                                                task.getProject().getWorkspace().getId(),
                                                loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElse(null);

                var projectRole = projectMemberRepository
                                .findByProject_IdAndUser_Id(
                                                task.getProject().getId(),
                                                loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElse(null);

                PermissionService.checkTaskPermission(
                                workspaceRole,
                                projectRole,
                                task,
                                loggedUser,
                                TaskPermission.REMOVE_COLLABORATOR);

                TaskCollaboratorModel collaborator = taskMemberRepository
                                .findByTask_IdAndUser_Id(taskId, userId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Colaborador não encontrado"));

                if (collaborator.getRole() == TaskRole.OWNER) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Transfira o responsável antes de remover o OWNER");
                }

                taskMemberRepository.delete(collaborator);
        }

        @Transactional
        public void transferOwnership(UUID taskId, UUID newOwnerUserId, UserModel loggedUser) {

                if (newOwnerUserId == null) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Novo responsável é obrigatório");
                }

                TaskModel task = taskRepository.findById(taskId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Tarefa não encontrada"));

                var workspaceRole = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(
                                                task.getProject().getWorkspace().getId(),
                                                loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElse(null);

                var projectRole = projectMemberRepository
                                .findByProject_IdAndUser_Id(
                                                task.getProject().getId(),
                                                loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElse(null);

                PermissionService.checkTaskPermission(
                                workspaceRole,
                                projectRole,
                                task,
                                loggedUser,
                                TaskPermission.ADD_COLLABORATOR);

                UserModel newOwner = userRepository.findById(newOwnerUserId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Usuário não encontrado"));

                workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(task.getProject().getWorkspace().getId(), newOwnerUserId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "Usuário não pertence ao workspace"));

                UserModel previousOwner = task.getCreatedBy();

                taskMemberRepository.findByTask_Id(taskId)
                                .forEach(collaborator -> {
                                        if (collaborator.getRole() == TaskRole.OWNER &&
                                                        !collaborator.getUser().getId().equals(newOwnerUserId)) {
                                                collaborator.setRole(TaskRole.COLLABORATOR);
                                                taskMemberRepository.save(collaborator);
                                        }
                                });

                TaskCollaboratorModel newOwnerCollaborator = taskMemberRepository
                                .findByTask_IdAndUser_Id(taskId, newOwnerUserId)
                                .orElseGet(() -> {
                                        TaskCollaboratorModel collaborator = new TaskCollaboratorModel();
                                        collaborator.setTask(task);
                                        collaborator.setUser(newOwner);
                                        return collaborator;
                                });

                newOwnerCollaborator.setRole(TaskRole.OWNER);
                taskMemberRepository.save(newOwnerCollaborator);

                if (previousOwner != null && !previousOwner.getId().equals(newOwnerUserId)) {
                        TaskCollaboratorModel previousOwnerCollaborator = taskMemberRepository
                                        .findByTask_IdAndUser_Id(taskId, previousOwner.getId())
                                        .orElseGet(() -> {
                                                TaskCollaboratorModel collaborator = new TaskCollaboratorModel();
                                                collaborator.setTask(task);
                                                collaborator.setUser(previousOwner);
                                                return collaborator;
                                        });

                        previousOwnerCollaborator.setRole(TaskRole.COLLABORATOR);
                        taskMemberRepository.save(previousOwnerCollaborator);
                }

                task.setCreatedBy(newOwner);
                taskRepository.save(task);

                notificationService.notifyTaskOwnershipTransferred(task, newOwner, previousOwner, loggedUser);
        }

        public List<TaskCollaboratorResponseDTO> list(UUID taskId, UserModel loggedUser) {

                TaskModel task = taskRepository.findById(taskId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Tarefa não encontrada"));

                var workspaceRole = workspaceMemberRepository
                                .findByWorkspace_IdAndUser_Id(
                                                task.getProject().getWorkspace().getId(),
                                                loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElse(null);

                var projectRole = projectMemberRepository
                                .findByProject_IdAndUser_Id(
                                                task.getProject().getId(),
                                                loggedUser.getId())
                                .map(m -> m.getRole())
                                .orElse(null);

                PermissionService.checkTaskPermission(
                                workspaceRole,
                                projectRole,
                                task,
                                loggedUser,
                                TaskPermission.VIEW_TASK);

                return taskMemberRepository.findByTask_Id(taskId)
                                .stream()
                                .map(c -> new TaskCollaboratorResponseDTO(
                                                c.getUser().getId(),
                                                c.getUser().getName(),
                                                c.getRole()))
                                .toList();
        }
}
