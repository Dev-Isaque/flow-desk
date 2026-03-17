package br.com.api.flowDesk.dto.taskitem.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTaskItemRequest {
    private String title;
    private Integer position;
}
