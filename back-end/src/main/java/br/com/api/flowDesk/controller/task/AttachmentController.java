package br.com.api.flowDesk.controller.task;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.api.flowDesk.dto.task.AttachmentDTO;
import br.com.api.flowDesk.model.task.AttachmentModel; // Import do model para o download
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.task.AttachmentService;

@RestController
@RequestMapping("/tasks/{taskId}/attachments")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    private AuthTokenService authTokenService;

    @GetMapping
    public List<AttachmentDTO> attachmentsByTask(@PathVariable UUID taskId) {
        return attachmentService.findByTask(taskId);
    }

    @PostMapping
    public AttachmentDTO upload(
            @PathVariable UUID taskId,
            @RequestParam MultipartFile file,
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.replace("Bearer ", "").trim();
        authTokenService.requireUserByToken(token);

        return attachmentService.upload(taskId, file);
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<Void> delete(@PathVariable UUID attachmentId) {
        attachmentService.delete(attachmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable UUID taskId,
            @PathVariable UUID attachmentId) {

        AttachmentModel attachment = attachmentService.findById(attachmentId);

        Resource file = attachmentService.loadFileAsResource(attachment.getStoredFileName());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getOriginalFileName() + "\"")
                .body(file);
    }

}