package br.com.api.flowDesk.service.task;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.api.flowDesk.dto.task.TagDTO;
import br.com.api.flowDesk.dto.task.request.CreateTagRequest;
import br.com.api.flowDesk.dto.task.request.UpdateTagRequest;
import br.com.api.flowDesk.model.task.TagModel;
import br.com.api.flowDesk.model.task.WorkspaceModel;
import br.com.api.flowDesk.repository.task.TagRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final WorkspaceRepository workspaceRepository;

    public List<TagDTO> listByWorkspace(UUID workspaceId) {

        List<TagModel> tags = tagRepository.findByWorkspace_Id(workspaceId);

        return tags.stream()
                .map(tag -> new TagDTO(
                        tag.getId(),
                        tag.getName(),
                        tag.getColor(),
                        tag.getTasks().size()))
                .toList();
    }

    @Transactional
    public TagDTO create(UUID workspaceId, CreateTagRequest dto) {

        String cleanedName = dto.getName().trim();

        Optional<TagModel> existingTag = tagRepository.findByWorkspaceIdAndNameIgnoreCase(workspaceId, cleanedName);

        if (existingTag.isPresent()) {

            TagModel tag = existingTag.get();

            return new TagDTO(
                    tag.getId(),
                    tag.getName(),
                    tag.getColor(),
                    tag.getTasks().size());
        }

        WorkspaceModel workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace não encontrado"));

        TagModel newTag = new TagModel();
        newTag.setName(cleanedName);
        newTag.setColor(dto.getColor());
        newTag.setWorkspace(workspace);

        tagRepository.save(newTag);

        return new TagDTO(
                newTag.getId(),
                newTag.getName(),
                newTag.getColor(),
                0);
    }

    @Transactional
    public TagDTO update(UUID workspaceId, UUID tagId, UpdateTagRequest dto) {

        TagModel tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag não encontrada"));

        if (!tag.getWorkspace().getId().equals(workspaceId)) {
            throw new RuntimeException("Tag não pertence a este workspace");
        }

        String cleanedName = dto.getName().trim();

        Optional<TagModel> existingTag = tagRepository.findByWorkspaceIdAndNameIgnoreCase(workspaceId, cleanedName);

        if (existingTag.isPresent() && !existingTag.get().getId().equals(tagId)) {
            throw new RuntimeException("Já existe uma tag com esse nome");
        }

        tag.setName(cleanedName);
        tag.setColor(dto.getColor());

        tagRepository.save(tag);

        return new TagDTO(
                tag.getId(),
                tag.getName(),
                tag.getColor(),
                tag.getTasks().size());
    }

    @Transactional
    public void delete(UUID workspaceId, UUID tagId) {

        TagModel tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag não encontrada"));

        if (!tag.getWorkspace().getId().equals(workspaceId)) {
            throw new RuntimeException("Tag não pertence a este workspace");
        }

        tagRepository.delete(tag);
    }
}