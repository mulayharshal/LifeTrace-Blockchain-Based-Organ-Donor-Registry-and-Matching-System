package com.lifetrace.backend.model;

import com.lifetrace.backend.util.TransplantStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transplant_cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransplantCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ============================================================
    // RELATIONS
    // ============================================================

    @ManyToOne
    @JoinColumn(name = "organ_id", nullable = false)
    private Organ organ;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private Recipient recipient;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    private Long donorId;

    // ============================================================
    // STATUS
    // ============================================================

    @Enumerated(EnumType.STRING)
    private TransplantStatus status;

    // ============================================================
    // LIFECYCLE TIMES
    // ============================================================

    private LocalDateTime allocationTime;

    private LocalDateTime retrievalTime;

    private LocalDateTime dispatchTime;

    private LocalDateTime receivedTime;

    private LocalDateTime surgeryStartTime;

    private LocalDateTime surgeryEndTime;

    // ============================================================
    // SURGERY RESULT
    // ============================================================

    private Boolean success;

    @Column(length = 1000)
    private String surgeryNotes;

    // ============================================================
    // META
    // ============================================================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
