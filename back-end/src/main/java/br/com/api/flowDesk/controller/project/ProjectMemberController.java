package br.com.api.flowDesk.controller.project;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.project.ProjectMemberDTO;
import br.com.api.flowDesk.dto.project.request.AddMemberProjectRequest;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.project.ProjectMemberRepository;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.project.ProjectMemberService;

@RestController
@RequestMapping("/projects/{projectId}/members")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProjectMemberController {

    @Autowired
    private ProjectMemberService projectMemberService;

    @Autowired
    private AuthTokenService authTokenService;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @GetMapping
    public ResponseEntity<List<ProjectMemberDTO>> listMembers(
            @PathVariable UUID projectId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();

        UserModel user = authTokenService.requireUserByToken(token);

        var members = projectMemberService.listMembers(projectId);

        return ResponseEntity.ok(members);
    }

    @PostMapping
    public ResponseEntity<Void> addMember(
            @PathVariable UUID projectId,
            @RequestBody AddMemberProjectRequest dto,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();

        UserModel user = authTokenService.requireUserByToken(token);

        projectMemberService.addMember(projectId, dto.getEmailToAdd(), user);

        return ResponseEntity.ok().build();
    }

}
