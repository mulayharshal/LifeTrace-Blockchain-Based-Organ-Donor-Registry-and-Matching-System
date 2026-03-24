package com.lifetrace.backend.service;

import com.lifetrace.backend.dto.TransplantTimelineResponse;
import com.lifetrace.backend.exception.ResourceNotFoundException;
import com.lifetrace.backend.exception.UnauthorizedException;
import com.lifetrace.backend.model.*;
import com.lifetrace.backend.repository.*;
import com.lifetrace.backend.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransplantCaseService {

    private final TransplantCaseRepository transplantCaseRepository;
    private final OrganRepository organRepository;
    private final RecipientRepository recipientRepository;
    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;

    // 🔥 ADD THIS LINE (ONLY NEW DEPENDENCY)
    private final BlockchainService blockchainService;

    // ============================================================
    // CREATE TRANSPLANT CASE
    // ============================================================

    public TransplantCase createCase(Organ organ, Recipient recipient) {

        TransplantCase transplantCase = TransplantCase.builder()
                .organ(organ)
                .recipient(recipient)
                .organHospital(organ.getHospital())
                .recipientHospital(recipient.getHospital())
                .donorId(organ.getDonorId())
                .status(TransplantStatus.MATCHED)
                .allocationTime(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return transplantCaseRepository.save(transplantCase);
    }

    // ============================================================
    // DISPATCH ORGAN (ONLY ORGAN HOSPITAL)
    // ============================================================

    public TransplantCase dispatch(Long caseId) {

        TransplantCase transplantCase = getCase(caseId);

        Hospital loggedHospital = getLoggedHospital();

        if (!loggedHospital.getId().equals(
                transplantCase.getOrganHospital().getId())) {

            throw new UnauthorizedException(
                    "Only organ hospital can dispatch organ");
        }

        if (transplantCase.getStatus() != TransplantStatus.MATCHED) {
            throw new RuntimeException(
                    "Case must be MATCHED to dispatch");
        }

        transplantCase.setStatus(TransplantStatus.IN_TRANSIT);
        transplantCase.setDispatchTime(LocalDateTime.now());
        transplantCase.setUpdatedAt(LocalDateTime.now());

        return transplantCaseRepository.save(transplantCase);
    }

    // ============================================================
    // RECEIVE ORGAN (ONLY RECIPIENT HOSPITAL)
    // ============================================================

    public TransplantCase receive(Long caseId) {

        TransplantCase transplantCase = getCase(caseId);

        Hospital loggedHospital = getLoggedHospital();

        if (!loggedHospital.getId().equals(
                transplantCase.getRecipientHospital().getId())) {

            throw new UnauthorizedException(
                    "Only recipient hospital can receive organ");
        }

        if (transplantCase.getStatus() != TransplantStatus.IN_TRANSIT) {
            throw new RuntimeException("Case must be IN_TRANSIT");
        }

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

        Hospital loggedHospital = getLoggedHospital();

        if (!loggedHospital.getId().equals(
                transplantCase.getRecipientHospital().getId())) {

            throw new UnauthorizedException(
                    "Only recipient hospital can start surgery");
        }

        if (transplantCase.getStatus() != TransplantStatus.RECEIVED) {
            throw new RuntimeException("Case must be RECEIVED");
        }

        transplantCase.setStatus(
                TransplantStatus.SURGERY_IN_PROGRESS);
        transplantCase.setSurgeryStartTime(LocalDateTime.now());
        transplantCase.setUpdatedAt(LocalDateTime.now());

        return transplantCaseRepository.save(transplantCase);
    }

    // ============================================================
    // COMPLETE SURGERY (UPDATED ONLY HERE)
    // ============================================================

    public TransplantCase completeSurgery(
            Long caseId,
            boolean success,
            String notes
    ) {

        TransplantCase transplantCase = getCase(caseId);

        Hospital loggedHospital = getLoggedHospital();

        if (!loggedHospital.getId().equals(
                transplantCase.getRecipientHospital().getId())) {

            throw new UnauthorizedException(
                    "Only recipient hospital can complete surgery");
        }

        if (transplantCase.getStatus()
                != TransplantStatus.SURGERY_IN_PROGRESS) {

            throw new RuntimeException(
                    "Surgery must be in progress");
        }

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

        // 🔥 NEW BLOCKCHAIN CODE (ONLY ADDITION)
        try {
            org.web3j.protocol.core.methods.response.TransactionReceipt receipt =
                    blockchainService.storeSurgeryResult(
                            transplantCase.getId(),
                            success
                    );

            if (receipt != null && receipt.getTransactionHash() != null) {
                transplantCase.setBlockchainTxHash(receipt.getTransactionHash());
            }

        } catch (Exception e) {
            System.out.println("❌ Blockchain surgery failed: " + e.getMessage());
        }

        return transplantCaseRepository.save(transplantCase);
    }

    // ============================================================
    // GET TIMELINE
    // ============================================================

    public TransplantCase getTimeline(Long caseId) {
        return getCase(caseId);
    }

    public List<TransplantCase> getAllCases() {
        return transplantCaseRepository.findAll();
    }

    private TransplantCase getCase(Long caseId) {
        return transplantCaseRepository.findById(caseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Transplant case not found"));
    }

    private Hospital getLoggedHospital() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return hospitalRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found"));
    }
}