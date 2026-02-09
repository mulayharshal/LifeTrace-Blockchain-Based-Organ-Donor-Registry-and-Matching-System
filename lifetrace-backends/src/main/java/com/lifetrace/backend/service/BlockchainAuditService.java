package com.lifetrace.backend.service;

import com.lifetrace.backend.exception.ResourceNotFoundException;
import com.lifetrace.backend.model.Organ;
import com.lifetrace.backend.model.Donor;
import com.lifetrace.backend.repository.OrganRepository;
import com.lifetrace.backend.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.web3j.abi.datatypes.Type;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BlockchainAuditService {

    private final DonorRepository donorRepository;
    private final OrganRepository organRepository;
    private final BlockchainService blockchainService;

    // ============================================================
    // VERIFY DONOR CONSENT
    // ============================================================
    public Map<String, Object> verifyDonorConsent(Long donorId) {

        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found with ID: " + donorId)
                );

        String dbHash = donor.getConsentHash();
        String blockchainHash = blockchainService.getDonorConsentHash(donorId);

        boolean blockchainRecordExists =
                blockchainHash != null && !blockchainHash.isEmpty();

        boolean match =
                blockchainRecordExists &&
                        dbHash != null &&
                        dbHash.equals(blockchainHash);

        Map<String, Object> response = new HashMap<>();
        response.put("donorId", donorId);
        response.put("dbHash", dbHash);
        response.put("blockchainHash", blockchainHash);
        response.put("blockchainRecordExists", blockchainRecordExists);
        response.put("match", match);
        response.put("status", match ? "VALID" : "TAMPERED");

        return response;
    }

    // ============================================================
    // VERIFY ORGAN ALLOCATION
    // ============================================================
    public Map<String, Object> verifyOrganAllocation(Long organId) {

        Organ organ = organRepository.findById(organId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Organ not found with ID: " + organId)
                );

        Map<String, Object> response = new HashMap<>();

        List<Type> blockchainData = blockchainService.getOrganAllocation(organId);

        // 🔥 SAFE CHECK
        if (blockchainData == null || blockchainData.isEmpty()) {
            response.put("organId", organId);
            response.put("blockchainRecordExists", false);
            response.put("match", false);
            response.put("message", "No blockchain record found");
            return response;
        }

        BigInteger bcOrganId = (BigInteger) blockchainData.get(0).getValue();
        BigInteger bcDonorId = (BigInteger) blockchainData.get(1).getValue();
        BigInteger bcHospitalId = (BigInteger) blockchainData.get(2).getValue();

        Long dbDonorId = organ.getDonorId();
        Long dbHospitalId =
                organ.getHospital() != null ? organ.getHospital().getId() : null;

        boolean blockchainRecordExists = bcOrganId.longValue() != 0;

        boolean match =
                blockchainRecordExists &&
                        dbDonorId != null &&
                        dbHospitalId != null &&
                        bcOrganId.longValue() == organ.getId() &&
                        bcDonorId.longValue() == dbDonorId &&
                        bcHospitalId.longValue() == dbHospitalId;

        response.put("organId", organId);
        response.put("dbDonorId", dbDonorId);
        response.put("dbHospitalId", dbHospitalId);
        response.put("blockchainDonorId", bcDonorId.longValue());
        response.put("blockchainHospitalId", bcHospitalId.longValue());
        response.put("blockchainRecordExists", blockchainRecordExists);
        response.put("match", match);
        response.put("status", match ? "VALID" : "TAMPERED");

        return response;
    }
}