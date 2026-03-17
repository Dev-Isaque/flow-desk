package br.com.api.flowDesk.controller.project;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.dto.project.request.CreateProjectRequest;
import br.com.api.flowDesk.dto.project.response.ProjectResponse;
import br.com.api.flowDesk.model.project.ProjectModel;
import br.com.api.flowDesk.model.user.UserModel;
import br.com.api.flowDesk.repository.project.ProjectRepository;
import br.com.api.flowDesk.service.auth.AuthTokenService;
import br.com.api.flowDesk.service.project.ProjectService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private AuthTokenService authTokenService;

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/create")
    public ResponseEntity<ProjectModel> create(
            @RequestBody @Valid CreateProjectRequest dto,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        var created = projectService.create(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public List<ProjectModel> myProjects(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        return projectRepository.findProjectsByUser(user.getId());
    }

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<ProjectResponse>> myProjectsByWorkspace(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable UUID workspaceId) {

        String token = authHeader.replace("Bearer ", "").trim();
        UserModel user = authTokenService.requireUserByToken(token);

        var projects = projectService.findProjectsByWorkspace(workspaceId, user);

        return ResponseEntity.ok(projects);
    }

}
