package br.com.api.flowDesk.service.task;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import br.com.api.flowDesk.dto.task.CommentDTO;
import br.com.api.flowDesk.dto.task.request.CreateCommentRequest;
import br.com.api.flowDesk.model.task.CommentModel;
import br.com.api.flowDesk.model.task.TaskModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.task.CommentsRepository;
import br.com.api.flowDesk.repository.task.TaskRepository;
import jakarta.transaction.Transactional;

@Service
public class CommentService {

    @Autowired
    private CommentsRepository commentRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private CommentDTO toDTO(CommentModel save) {
        return new CommentDTO(
                save.getId(),
                save.getContent(),
                save.getAuthor().getId(),
                save.getAuthor().getName(),
                save.getTask().getId(),
                save.getCreatedAt(),
                save.getUpdatedAt());
    }

    public List<CommentDTO> listByTask(UUID taskId) {

        TaskModel task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        return commentRepository.findByTask(task)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public CommentDTO create(CreateCommentRequest dto, UserModel user) {

        TaskModel task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        var comment = new CommentModel();
        comment.setContent(dto.getContent());
        comment.setAuthor(user);
        comment.setTask(task);

        CommentDTO createdComment = toDTO(commentRepository.save(comment));

        messagingTemplate.convertAndSend(
                "/topic/tasks/" + task.getId() + "/comments",
                createdComment);

        return createdComment;
    }

}
