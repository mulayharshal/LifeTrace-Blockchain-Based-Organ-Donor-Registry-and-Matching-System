package com.lifetrace.backend.service;

import com.lifetrace.backend.exception.ResourceNotFoundException;
import com.lifetrace.backend.model.Hospital;
import com.lifetrace.backend.repository.HospitalRepository;
import com.lifetrace.backend.repository.OrganRepository;
import com.lifetrace.backend.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final HospitalRepository hospitalRepository;
    private final DonorRepository donorRepository;
    private final OrganRepository organRepository;

    // ==============================================
    // 1️⃣ Get All Hospitals
    // ==============================================
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    // ==============================================
    // 2️⃣ Get Pending Hospitals
    // ==============================================
    public List<Hospital> getPendingHospitals() {
        return hospitalRepository.findByApprovedFalse();
    }

    // ==============================================
    // 3️⃣ Approve Hospital
    // ==============================================
    public Hospital approveHospital(Long hospitalId) {

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found with ID: " + hospitalId));

        hospital.setApproved(true);
        hospital.setBlocked(false);

        return hospitalRepository.save(hospital);
    }

    // ==============================================
    // 4️⃣ Block Hospital
    // ==============================================
    public Hospital blockHospital(Long hospitalId) {

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found with ID: " + hospitalId));

        hospital.setBlocked(true);

        return hospitalRepository.save(hospital);
    }

    // ==============================================
    // 5️⃣ Unblock Hospital
    // ==============================================
    public Hospital unblockHospital(Long hospitalId) {

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found with ID: " + hospitalId));

        hospital.setBlocked(false);

        return hospitalRepository.save(hospital);
    }

    // ==============================================
    // 6️⃣ Audit Data
    // ==============================================
    public Map<String, Object> getAuditData() {

        Map<String, Object> data = new HashMap<>();

        data.put("totalDonors", donorRepository.count());
        data.put("totalHospitals", hospitalRepository.count());
        data.put("totalOrgans", organRepository.count());

        return data;
    }
}