package com.lifetrace.backend.repository;

import com.lifetrace.backend.model.Donor;
import com.lifetrace.backend.model.Hospital;
import com.lifetrace.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    Optional<Hospital> findByUser(User user);
    Optional<Hospital> findByEmail(String email);
    List<Hospital> findByApprovedFalse();



}