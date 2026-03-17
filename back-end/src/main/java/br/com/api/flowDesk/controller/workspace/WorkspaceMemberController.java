package br.com.api.flowDesk.controller.workspace;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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

import br.com.api.flowDesk.dto.workspace.WorkspaceMemberDTO;
import br.com.api.flowDesk.dto.workspace.request.AddMemberRequest;
import br.com.api.flowDesk.dto.workspace.request.UpdateMemberRoleRequest;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.workspace.WorkspaceMemberService;

@RestController
@RequestMapping("/workspaces/{workspaceId}/members")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WorkspaceMemberController {

    @Autowired
    private WorkspaceMemberService workspaceMemberService;

    @Autowired
    private AuthTokenService authTokenService;

    @GetMapping
    public ResponseEntity<List<WorkspaceMemberDTO>> listMembers(
            @PathVariable UUID workspaceId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        var members = workspaceMemberService.listMembers(workspaceId);

        return ResponseEntity.ok(members);
    }

    @PostMapping
    public ResponseEntity<Void> addMember(
            @PathVariable UUID workspaceId,
            @RequestBody AddMemberRequest dto,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        workspaceMemberService.addMember(workspaceId, dto.getEmailToAdd(), user);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{memberId}")
    public ResponseEntity<Void> editMember(
            @PathVariable UUID workspaceId,
            @PathVariable UUID memberId,
            @RequestBody UpdateMemberRoleRequest dto,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();

        UserModel user = authTokenService.requireUserByToken(token);

        workspaceMemberService.updateMember(workspaceId, memberId, dto.getRole(), user);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> removedMember(
            @PathVariable UUID workspaceId,
            @PathVariable UUID memberId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer", "").trim();
        UserModel loggedUser = authTokenService.requireUserByToken(token);

        workspaceMemberService.removedMember(workspaceId, memberId, loggedUser);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/leave")
    public ResponseEntity<Void> leaveWorkspace(
            @PathVariable UUID workspaceId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer", "").trim();
        UserModel loggedUser = authTokenService.requireUserByToken(token);

        workspaceMemberService.leaveWorkspace(workspaceId, loggedUser);

        return ResponseEntity.noContent().build();
    }

}