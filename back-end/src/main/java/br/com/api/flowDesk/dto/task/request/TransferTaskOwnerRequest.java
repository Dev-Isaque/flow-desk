package br.com.api.flowDesk.dto.task.request;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransferTaskOwnerRequest {
    private UUID userId;
}
