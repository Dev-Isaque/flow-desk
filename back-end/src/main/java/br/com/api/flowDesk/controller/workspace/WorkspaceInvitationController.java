package br.com.api.flowDesk.controller.workspace;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.workspace.WorkspaceInvitationDTO;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.workspace.WorkspaceMemberService;

@RestController
@RequestMapping("/workspaces/invitations")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WorkspaceInvitationController {

    @Autowired
    private WorkspaceMemberService workspaceMemberService;

    @Autowired
    private AuthTokenService authTokenService;

    @GetMapping("/pending")
    public ResponseEntity<List<WorkspaceInvitationDTO>> listPending(
            @RequestHeader("Authorization") String authHeader) {

        UserModel user = getUser(authHeader);

        return ResponseEntity.ok(workspaceMemberService.listPendingInvitations(user));
    }

    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<WorkspaceInvitationDTO> accept(
            @PathVariable UUID invitationId,
            @RequestHeader("Authorization") String authHeader) {

        UserModel user = getUser(authHeader);

        return ResponseEntity.ok(workspaceMemberService.acceptInvitation(invitationId, user));
    }

    @PostMapping("/{invitationId}/decline")
    public ResponseEntity<WorkspaceInvitationDTO> decline(
            @PathVariable UUID invitationId,
            @RequestHeader("Authorization") String authHeader) {

        UserModel user = getUser(authHeader);

        return ResponseEntity.ok(workspaceMemberService.declineInvitation(invitationId, user));
    }

    private UserModel getUser(String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        return authTokenService.requireUserByToken(token);
    }
}
