package br.com.api.flowDesk.service.notification;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.com.api.flowDesk.repository.task.TaskCollaboratorRepository;
import br.com.api.flowDesk.repository.task.TaskRepository;

@Component
public class TaskDueReminderScheduler {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskCollaboratorRepository taskCollaboratorRepository;

    @Autowired
    private NotificationService notificationService;

    @Scheduled(fixedDelayString = "${notifications.due-reminder-interval-ms:60000}")
    @Transactional
    public void notifyDueSoonTasks() {
        LocalDateTime now = LocalDateTime.now();
        int minutesBefore = 60;
        LocalDateTime until = now.plusMinutes(minutesBefore);

        var dueSoonTasks = taskRepository.findTasksDueBetweenForReminder(now, until);

        for (var task : dueSoonTasks) {
            var collaborators = taskCollaboratorRepository.findByTask_Id(task.getId());
            if (!collaborators.isEmpty()) {
                notificationService.notifyTaskDueSoon(task, collaborators);
            }
            task.setDueReminderSentAt(LocalDateTime.now());
            taskRepository.save(task);
        }
    }
}
