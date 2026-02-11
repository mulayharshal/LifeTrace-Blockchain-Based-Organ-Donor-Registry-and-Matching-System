package com.lifetrace.backend.service;

import com.lifetrace.backend.dto.TransplantTimelineResponse;
import com.lifetrace.backend.exception.ResourceNotFoundException;
import com.lifetrace.backend.model.*;
import com.lifetrace.backend.repository.*;
import com.lifetrace.backend.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransplantCaseService {

    private final TransplantCaseRepository transplantCaseRepository;
    private final OrganRepository organRepository;
    private final RecipientRepository recipientRepository;

    // ============================================================
    // CREATE TRANSPLANT CASE (CALLED FROM OrganService)
    // ============================================================

    public TransplantCase createCase(Organ organ, Recipient recipient) {

        TransplantCase transplantCase = TransplantCase.builder()
                .organ(organ)
                .recipient(recipient)
                .hospital(recipient.getHospital())
                .donorId(organ.getDonorId())
                .status(TransplantStatus.MATCHED)
                .allocationTime(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return transplantCaseRepository.save(transplantCase);
    }

    // ============================================================
    // MARK RETRIEVED
    // ============================================================

    public TransplantCase markRetrieved(Long caseId) {

        TransplantCase transplantCase = getCase(caseId);

        if (transplantCase.getStatus() != TransplantStatus.MATCHED)
            throw new RuntimeException("Case must be MATCHED");

        transplantCase.setStatus(TransplantStatus.RETRIEVED);
        transplantCase.setRetrievalTime(LocalDateTime.now());
        transplantCase.setUpdatedAt(LocalDateTime.now());

        transplantCase.getOrgan().setStatus(OrganStatus.RETRIEVED);
        organRepository.save(transplantCase.getOrgan());

        return transplantCaseRepository.save(transplantCase);
    }

    // ============================================================
    // MARK IN TRANSIT
    // ============================================================

    public TransplantCase markInTransit(Long caseId) {

        TransplantCase transplantCase = getCase(caseId);

        if (transplantCase.getStatus() != TransplantStatus.RETRIEVED)
            throw new RuntimeException("Case must be RETRIEVED");

        transplantCase.setStatus(TransplantStatus.IN_TRANSIT);
        transplantCase.setDispatchTime(LocalDateTime.now());
        transplantCase.setUpdatedAt(LocalDateTime.now());

        return transplantCaseRepository.save(transplantCase);
    }

    // ============================================================
    // MARK RECEIVED
    // ============================================================

    public TransplantCase markReceived(Long caseId) {

        TransplantCase transplantCase = getCase(caseId);

        if (transplantCase.getStatus() != TransplantStatus.IN_TRANSIT)
            throw new RuntimeException("Case must be IN_TRANSIT");

        transplantCase.setStatus(TransplantStatus.RECEIVED);
        transplantCase.setReceivedTime(LocalDateTime.now());
        transplantCase.setUpdatedAt(LocalDateTime.now());

        transplantCase.getOrgan().setStatus(OrganStatus.RECEIVED);
        organRepository.save(transplantCase.getOrgan());

        return transplantCaseRepository.save(transplantCase);
    }

    // ============================================================
    // START SURGERY
    // ============================================================

    public TransplantCase startSurgery(Long caseId) {

        TransplantCase transplantCase = getCase(caseId);

        if (transplantCase.getStatus() != TransplantStatus.RECEIVED)
            throw new RuntimeException("Case must be RECEIVED");

        transplantCase.setStatus(TransplantStatus.SURGERY_IN_PROGRESS);
        transplantCase.setSurgeryStartTime(LocalDateTime.now());
        transplantCase.setUpdatedAt(LocalDateTime.now());

        return transplantCaseRepository.save(transplantCase);
    }

    // ============================================================
    // COMPLETE SURGERY
    // ============================================================

    public TransplantCase completeSurgery(
            Long caseId,
            boolean success,
            String notes
    ) {

        TransplantCase transplantCase = getCase(caseId);

        if (transplantCase.getStatus() != TransplantStatus.SURGERY_IN_PROGRESS)
            throw new RuntimeException("Surgery must be in progress");

        transplantCase.setSurgeryEndTime(LocalDateTime.now());
        transplantCase.setSuccess(success);
        transplantCase.setSurgeryNotes(notes);
        transplantCase.setUpdatedAt(LocalDateTime.now());

        Organ organ = transplantCase.getOrgan();
        Recipient recipient = transplantCase.getRecipient();

        if (success) {
            transplantCase.setStatus(TransplantStatus.COMPLETED);
            recipient.setStatus(RecipientStatus.COMPLETED);
            organ.setStatus(OrganStatus.RECEIVED);
        } else {
            transplantCase.setStatus(TransplantStatus.FAILED);
            recipient.setStatus(RecipientStatus.FAILED);
            organ.setStatus(OrganStatus.CANCELLED);
        }

        recipientRepository.save(recipient);
        organRepository.save(organ);

        return transplantCaseRepository.save(transplantCase);
    }

    // ============================================================
    // HELPER
    // ============================================================

    private TransplantCase getCase(Long caseId) {
        return transplantCaseRepository.findById(caseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Transplant case not found"));
    }
    // ============================================================
// GET CASE TIMELINE
// ============================================================

    public TransplantTimelineResponse getTimeline(Long caseId) {

        TransplantCase transplantCase = transplantCaseRepository.findById(caseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Transplant case not found"));

        return TransplantTimelineResponse.builder()
                .caseId(transplantCase.getId())
                .organType(transplantCase.getOrgan().getOrganType())
                .hospitalName(transplantCase.getHospital().getHospitalName())
                .status(transplantCase.getStatus())
                .allocationTime(transplantCase.getAllocationTime())
                .retrievalTime(transplantCase.getRetrievalTime())
                .dispatchTime(transplantCase.getDispatchTime())
                .receivedTime(transplantCase.getReceivedTime())
                .surgeryStartTime(transplantCase.getSurgeryStartTime())
                .surgeryEndTime(transplantCase.getSurgeryEndTime())
                .success(transplantCase.getSuccess())
                .build();
    }

}
