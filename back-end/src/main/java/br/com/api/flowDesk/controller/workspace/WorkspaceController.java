package br.com.api.flowDesk.controller.workspace;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.workspace.request.AddMemberRequest;
import br.com.api.flowDesk.dto.workspace.request.CreateWorkspaceRequest;
import br.com.api.flowDesk.dto.workspace.response.WorkspaceResponse;
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
                        ws.getType()))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/cadastrar")
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

    @PostMapping("/add-member")
    public ResponseEntity<Void> addMember(
            @RequestBody AddMemberRequest dto,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        workspaceService.addMember(dto.getWorkspaceId(), dto.getEmailToAdd(), user);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/personal")
    public ResponseEntity<WorkspaceResponse> personal(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        var ws = workspaceService.getOrCreatePersonal(user);

        System.out.println(">>> workspace encontrado/criado: " + (ws != null ? ws.getId() : "NULL"));

        return ResponseEntity.ok(new WorkspaceResponse(
                ws.getId(),
                ws.getName(),
                ws.getColor(),
                ws.getType()));
    }

}
