package br.com.api.flowDesk.controller.enums;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.flowDesk.enums.task.TaskPriority;
import br.com.api.flowDesk.enums.task.TaskStatus;

@RestController
@RequestMapping("/enums")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EnumController {

    @GetMapping("/task-priority")
    public List<PriorityResponse> getPriorities() {
        return Arrays.stream(TaskPriority.values())
                .map(p -> new PriorityResponse(p.name(), p.getDescription(), p.getLevel()))
                .toList();
    }

    @GetMapping("/task-status")
    public List<StatusResponse> getStatuses() {
        return Arrays.stream(TaskStatus.values())
                .map(s -> new StatusResponse(s.name(), s.getDescription()))
                .toList();
    }

    public record PriorityResponse(String name, String description, int level) {
    }

    public record StatusResponse(String name, String description) {
    }
}