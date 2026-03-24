package com.lifetrace.backend.repository;

import com.lifetrace.backend.model.TransplantCase;
import com.lifetrace.backend.util.TransplantStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransplantCaseRepository extends JpaRepository<TransplantCase, Long> {


    long countByStatus(TransplantStatus status);

    List<TransplantCase> findByOrganHospitalId(Long hospitalId);

    List<TransplantCase> findByRecipientHospitalId(Long hospitalId);

    List<TransplantCase> findByStatus(TransplantStatus status);

}
