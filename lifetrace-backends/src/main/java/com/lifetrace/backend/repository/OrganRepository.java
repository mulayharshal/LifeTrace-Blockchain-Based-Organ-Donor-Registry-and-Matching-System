package com.lifetrace.backend.repository;

import com.lifetrace.backend.model.Hospital;
import com.lifetrace.backend.model.Organ;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganRepository extends JpaRepository<Organ, Long> {

    Optional<Organ> findFirstByOrganTypeAndBloodGroupAndStatus(
            String organType,
            String bloodGroup,
            String status
    );

    List<Organ> findByOrganTypeAndBloodGroupAndStatus(
            String organType,
            String bloodGroup,
            String status
    );

    // 🔥 NEW (Dashboard + Hospital listing)
    List<Organ> findByHospital(Hospital hospital);

    long countByHospital(Hospital hospital);

    long countByHospitalAndStatus(Hospital hospital, String status);

    long countByStatus(String status);
}