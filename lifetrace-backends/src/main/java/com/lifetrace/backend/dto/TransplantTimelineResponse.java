package com.lifetrace.backend.dto;

import com.lifetrace.backend.util.TransplantStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TransplantTimelineResponse {

    private Long caseId;
    private String organType;
    private String hospitalName;

    private TransplantStatus status;

    private LocalDateTime allocationTime;
    private LocalDateTime retrievalTime;
    private LocalDateTime dispatchTime;
    private LocalDateTime receivedTime;
    private LocalDateTime surgeryStartTime;
    private LocalDateTime surgeryEndTime;

    private Boolean success;
}
