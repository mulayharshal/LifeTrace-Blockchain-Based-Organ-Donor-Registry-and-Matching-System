package com.lifetrace.backend.repository;

import com.lifetrace.backend.model.Hospital;
import com.lifetrace.backend.model.Recipient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecipientRepository extends JpaRepository<Recipient, Long> {

    Optional<Recipient> findFirstByOrganTypeAndBloodGroupAndStatus(
            String organType,
            String bloodGroup,
            String status
    );

    List<Recipient> findByOrganTypeAndBloodGroupAndStatus(
            String organType,
            String bloodGroup,
            String status
    );

    // 🔥 NEW (Dashboard + Hospital listing)
    List<Recipient> findByHospital(Hospital hospital);

    long countByHospital(Hospital hospital);

    long countByHospitalAndStatus(Hospital hospital, String status);

    long countByStatus(String status);
}