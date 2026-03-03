package br.com.api.flowDesk.dto.task;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.api.flowDesk.model.task.AttachmentModel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttachmentDTO {

    private UUID id;

    private String originalFileName;

    private String contentType;

    private Long size;

    private String url;

    private UUID taskId;

    private LocalDateTime uploadedAt;

    public static AttachmentDTO fromEntity(AttachmentModel attachment) {
        return new AttachmentDTO(
                attachment.getId(),
                attachment.getOriginalFileName(),
                attachment.getContentType(),
                attachment.getSize(),
                "/attachments/" + attachment.getId(),
                attachment.getTask().getId(),
                attachment.getUploadedAt());
    }
}