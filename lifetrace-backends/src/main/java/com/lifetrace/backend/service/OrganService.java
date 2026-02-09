package com.lifetrace.backend.service;

import com.lifetrace.backend.dto.OrganRequestItem;
import com.lifetrace.backend.dto.RegisterOrganRequest;
import com.lifetrace.backend.exception.ResourceNotFoundException;
import com.lifetrace.backend.model.*;
import com.lifetrace.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

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

        if(hospital.getId()!=donor.getDeclaredByHospitalId()){
            Exception exc=new IllegalAccessException("Only the hospital register orgns who uploaded the death");
        }

        List<Organ> savedOrgans = new ArrayList<>();

        for (OrganRequestItem item : request.getOrgans()) {

            Organ organ = new Organ();
            organ.setOrganType(item.getOrganType());
            organ.setBloodGroup(donor.getBloodGroup());
            organ.setCondition(item.getCondition());
            organ.setStatus("AVAILABLE");
            organ.setDonorId(donor.getId());
            organ.setLocation(hospital.getAddress());
//            organ.setUrgencyLevel(request.getUrgencyLevel());
            organ.setHospital(hospital);

            Organ savedOrgan = organRepository.save(organ);

            donor.setOrgansRegistered(true);
            donorRepository.save(donor);
            // 🔥 Run matching when organ is added
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
                        "WAITING"
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

        // 4️⃣ Fallback first
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
                        "AVAILABLE"
                );

        if (organs.isEmpty()) return;

        // 1️⃣ Same location
        for (Organ organ : organs) {
            if (organ.getLocation() != null &&
                    organ.getLocation().equalsIgnoreCase(recipient.getLocation())) {

                allocateOrgan(organ, recipient);
                return;
            }
        }

        // 2️⃣ Fallback
        allocateOrgan(organs.get(0), recipient);
    }

    // ============================================================
    // SAFE ALLOCATION
    // ============================================================
    public void allocateOrgan(Organ organ, Recipient recipient) {

        organ.setStatus("ALLOCATED");
        organ.setRecipient(recipient);
        recipient.setStatus("MATCHED");

        organRepository.save(organ);
        recipientRepository.save(recipient);

        try {

            TransactionReceipt receipt = blockchainService.storeOrganAllocation(
                    organ.getId(),
                    organ.getDonorId(),
                    recipient.getHospital().getId()
            );

            organ.setBlockchainTxHash(receipt.getTransactionHash());
            organRepository.save(organ);

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