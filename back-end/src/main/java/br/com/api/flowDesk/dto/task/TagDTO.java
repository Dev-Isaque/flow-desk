package br.com.api.flowDesk.dto.task;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TagDTO {

    private UUID id;
    private String name;
    private String color;
    private long usage;
}