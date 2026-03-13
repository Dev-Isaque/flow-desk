package br.com.api.flowDesk.controller.workspace;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.workspace.request.CreateWorkspaceRequest;
import br.com.api.flowDesk.dto.workspace.request.UpdateWorkspaceRequest;
import br.com.api.flowDesk.dto.workspace.response.WorkspaceResponse;
import br.com.api.flowDesk.model.task.WorkspaceModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.workspace.WorkspaceService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/workspaces")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WorkspaceController {

        @Autowired
        private WorkspaceService workspaceService;

        @Autowired
        private AuthTokenService authTokenService;

        @GetMapping
        public ResponseEntity<List<WorkspaceResponse>> listWorkspaces(
                        @RequestHeader("Authorization") String authHeader) {

                String token = authHeader.replace("Bearer ", "").trim();
                UserModel user = authTokenService.requireUserByToken(token);

                var workspaces = workspaceService.findAllSharedByUser(user.getId());

                var response = workspaces.stream()
                                .map(ws -> new WorkspaceResponse(
                                                ws.getId(),
                                                ws.getName(),
                                                ws.getColor(),
                                                ws.getType(),
                                                ws.getMemberCount()))
                                .toList();

                return ResponseEntity.ok(response);
        }

        @PostMapping("/create")
        public ResponseEntity<WorkspaceResponse> create(
                        @RequestBody @Valid CreateWorkspaceRequest dto,
                        @RequestHeader("Authorization") String authHeader) {

                String token = authHeader.replace("Bearer ", "").trim();
                UserModel user = authTokenService.requireUserByToken(token);

                var created = workspaceService.create(dto, user);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new WorkspaceResponse(
                                                created.getId(),
                                                created.getName(),
                                                created.getColor(),
                                                created.getType()));
        }

        @PatchMapping("/{workspaceId}")
        public ResponseEntity<WorkspaceResponse> update(
                        @PathVariable UUID workspaceId,
                        @RequestBody @Valid UpdateWorkspaceRequest dto,
                        @RequestHeader("Authorization") String authHeader) {

                String token = authHeader.replace("Bearer ", "").trim();

                UserModel user = authTokenService.requireUserByToken(token);

                WorkspaceModel workspace = workspaceService.update(workspaceId, dto, user);

                WorkspaceResponse response = new WorkspaceResponse(
                                workspace.getId(),
                                workspace.getName(),
                                workspace.getColor(),
                                workspace.getType(),
                                workspace.getMembers().size());

                return ResponseEntity.ok(response);
        }

        @DeleteMapping("/{workspaceId}")
        public ResponseEntity<Void> delete(
                        @PathVariable UUID workspaceId,
                        @RequestHeader("Authorization") String authorization) {

                String token = authorization.replace("Bearer ", "").trim();
                var user = authTokenService.requireUserByToken(token);

                workspaceService.delete(workspaceId, user);

                return ResponseEntity.noContent().build();
        }

        @GetMapping("/personal")
        public ResponseEntity<WorkspaceResponse> personal(
                        @RequestHeader("Authorization") String authHeader) {

                String token = authHeader.replace("Bearer ", "").trim();
                UserModel user = authTokenService.requireUserByToken(token);

                var ws = workspaceService.getOrCreatePersonal(user);

                return ResponseEntity.ok(new WorkspaceResponse(
                                ws.getId(),
                                ws.getName(),
                                ws.getColor(),
                                ws.getType()));
        }
}