package br.com.api.flowDesk.controller.task;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.task.TagDTO;
import br.com.api.flowDesk.dto.task.request.CreateTagRequest;
import br.com.api.flowDesk.dto.task.request.UpdateTagRequest;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.task.TagService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/workspace")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TagController {

    @Autowired
    private TagService tagService;

    @Autowired
    private AuthTokenService authTokenService;

    @GetMapping("/{workspaceId}/tags")
    public ResponseEntity<List<TagDTO>> listByWorkspace(
            @PathVariable UUID workspaceId) {

        return ResponseEntity.ok(tagService.listByWorkspace(workspaceId));
    }

    @PostMapping("/{workspaceId}/tags")
    public ResponseEntity<TagDTO> create(
            @PathVariable UUID workspaceId,
            @RequestBody @Valid CreateTagRequest dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tagService.create(workspaceId, dto));
    }

    @PutMapping("/{workspaceId}/tags/{tagId}")
    public ResponseEntity<TagDTO> update(
            @PathVariable UUID workspaceId,
            @PathVariable UUID tagId,
            @RequestBody @Valid UpdateTagRequest dto) {

        return ResponseEntity.ok(
                tagService.update(workspaceId, tagId, dto));
    }

    @DeleteMapping("/{workspaceId}/tags/{tagId}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID workspaceId,
            @PathVariable UUID tagId) {

        tagService.delete(workspaceId, tagId);

        return ResponseEntity.noContent().build();
    }
}