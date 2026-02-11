package com.lifetrace.backend.service;

import com.lifetrace.backend.dto.OrganRequestItem;
import com.lifetrace.backend.dto.RegisterOrganRequest;
import com.lifetrace.backend.exception.ResourceNotFoundException;
import com.lifetrace.backend.model.*;
import com.lifetrace.backend.repository.*;
import com.lifetrace.backend.util.OrganStatus;
import com.lifetrace.backend.util.RecipientStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganService {

    private final OrganRepository organRepository;
    private final DonorRepository donorRepository;
    private final RecipientRepository recipientRepository;
    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;
    private final BlockchainService blockchainService;
    private final EmailService emailService;
    private final TransplantCaseService transplantCaseService;

    // ============================================================
    // MULTI ORGAN REGISTER
    // ============================================================
    public List<Organ> registerOrgan(RegisterOrganRequest request) {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Hospital not registered"));

        if (!hospital.isApproved()) {
            throw new RuntimeException("Hospital is not approved by admin");
        }

        Donor donor = donorRepository.findById(request.getDonorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donor not found with ID: " + request.getDonorId()
                        )
                );

        if (!hospital.getId().equals(donor.getDeclaredByHospitalId())) {
            throw new RuntimeException("Only declaring hospital can register organs");
        }

        List<Organ> savedOrgans = new ArrayList<>();

        for (OrganRequestItem item : request.getOrgans()) {

            Organ organ = new Organ();
            organ.setOrganType(item.getOrganType());
            organ.setBloodGroup(donor.getBloodGroup());
            organ.setCondition(item.getCondition());
            organ.setStatus(OrganStatus.AVAILABLE);
            organ.setDonorId(donor.getId());
            organ.setLocation(hospital.getAddress());
            organ.setHospital(hospital);

            Organ savedOrgan = organRepository.save(organ);

            donor.setOrgansRegistered(true);
            donorRepository.save(donor);

            tryMatchByOrgan(savedOrgan);

            savedOrgans.add(savedOrgan);
        }

        return savedOrgans;
    }

    // ============================================================
    // MATCH WHEN ORGAN REGISTERED
    // ============================================================
    public void tryMatchByOrgan(Organ organ) {

        List<Recipient> recipients = recipientRepository
                .findByOrganTypeAndBloodGroupAndStatus(
                        organ.getOrganType(),
                        organ.getBloodGroup(),
                        RecipientStatus.WAITING
                );

        if (recipients.isEmpty()) return;

        // 1️⃣ Same location + HIGH urgency
        for (Recipient r : recipients) {
            if (r.getLocation() != null &&
                    r.getLocation().equalsIgnoreCase(organ.getLocation()) &&
                    "HIGH".equalsIgnoreCase(r.getUrgencyLevel())) {

                allocateOrgan(organ, r);
                return;
            }
        }

        // 2️⃣ Same location
        for (Recipient r : recipients) {
            if (r.getLocation() != null &&
                    r.getLocation().equalsIgnoreCase(organ.getLocation())) {

                allocateOrgan(organ, r);
                return;
            }
        }

        // 3️⃣ HIGH urgency anywhere
        for (Recipient r : recipients) {
            if ("HIGH".equalsIgnoreCase(r.getUrgencyLevel())) {
                allocateOrgan(organ, r);
                return;
            }
        }

        // 4️⃣ Fallback
        allocateOrgan(organ, recipients.get(0));
    }

    // ============================================================
    // MATCH WHEN RECIPIENT REGISTERED
    // ============================================================
    public void tryMatchByRecipient(Recipient recipient) {

        List<Organ> organs = organRepository
                .findByOrganTypeAndBloodGroupAndStatus(
                        recipient.getOrganType(),
                        recipient.getBloodGroup(),
                        OrganStatus.AVAILABLE
                );

        if (organs.isEmpty()) return;

        for (Organ organ : organs) {
            if (organ.getLocation() != null &&
                    organ.getLocation().equalsIgnoreCase(recipient.getLocation())) {

                allocateOrgan(organ, recipient);
                return;
            }
        }

        allocateOrgan(organs.get(0), recipient);
    }

    // ============================================================
    // SAFE ALLOCATION + CREATE TRANSPLANT CASE
    // ============================================================
    public void allocateOrgan(Organ organ, Recipient recipient) {

        organ.setStatus(OrganStatus.ALLOCATED);
        organ.setRecipient(recipient);

        recipient.setStatus(RecipientStatus.MATCHED);

        organRepository.save(organ);
        recipientRepository.save(recipient);

        // 🔥 CREATE TRANSPLANT CASE
        transplantCaseService.createCase(organ, recipient);

        try {
            blockchainService.storeOrganAllocation(
                    organ.getId(),
                    organ.getDonorId(),
                    recipient.getHospital().getId()
            );
        } catch (Exception e) {
            throw new RuntimeException("Blockchain transaction failed", e);
        }

        try {
            emailService.sendHospitalMatchEmail(
                    recipient.getHospital().getUser().getEmail(),
                    organ,
                    recipient
            );
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }
    }
}
