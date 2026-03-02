package br.com.api.flowDesk.dto.task.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TagResponse {

    private UUID id;

    private String name;
}