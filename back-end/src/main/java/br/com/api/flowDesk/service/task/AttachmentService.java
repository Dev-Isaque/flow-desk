package br.com.api.flowDesk.service.task;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import br.com.api.flowDesk.dto.task.AttachmentDTO;
import br.com.api.flowDesk.model.task.AttachmentModel;
import br.com.api.flowDesk.model.task.TaskModel;
import br.com.api.flowDesk.repository.task.AttachmentRepository;
import br.com.api.flowDesk.repository.task.TaskRepository;

@Service
public class AttachmentService {

    @Value("${file.upload-dir}")
    private String UPLOAD_DIR;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private TaskRepository taskRepository;

    private void validateFile(MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("O arquivo está vazio");
        }

        if (file.getSize() > 10_000_000) {
            throw new RuntimeException("O arquivo exerce o tamanho máximo de 10mb");
        }

        List<String> allowedTypes = List.of(
                "image/png",
                "image/jpeg",
                "application/pdf");

        if (!allowedTypes.contains(file.getContentType())) {
            throw new RuntimeException("Invalid file type");
        }

    }

    public AttachmentModel findById(UUID attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Anexo não encontrado"));
    }

    public List<AttachmentDTO> findByTask(UUID taskId) {

        return attachmentRepository.findByTaskId(taskId)
                .stream()
                .map(AttachmentDTO::fromEntity)
                .toList();
    }

    @Transactional
    public AttachmentDTO upload(UUID taskId, MultipartFile file) {

        TaskModel task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        validateFile(file);

        String originalFileName = file.getOriginalFilename();
        String storedFileName = UUID.randomUUID() + "_" + originalFileName;

        Path uploadPath = Paths.get(UPLOAD_DIR);

        try {
            Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), uploadPath.resolve(storedFileName));
        } catch (IOException e) {
            throw new RuntimeException("Error saving file");
        }

        AttachmentModel attachment = new AttachmentModel();
        attachment.setOriginalFileName(originalFileName);
        attachment.setStoredFileName(storedFileName);
        attachment.setStoragePath(uploadPath.resolve(storedFileName).toString());
        attachment.setContentType(file.getContentType());
        attachment.setSize(file.getSize());
        attachment.setTask(task);

        attachmentRepository.save(attachment);

        return AttachmentDTO.fromEntity(attachment);
    }

    @Transactional
    public void delete(UUID attachmentId) {

        AttachmentModel attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Anexo não encontrado"));

        try {
            Path filePath = Paths.get(attachment.getStoragePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao deletar arquivo físico");
        }

        attachmentRepository.delete(attachment);
    }

    public Resource loadFileAsResource(String storedFileName) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(storedFileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Não foi possível ler o arquivo: " + storedFileName);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Erro no caminho do arquivo: " + storedFileName, e);
        }
    }

}
