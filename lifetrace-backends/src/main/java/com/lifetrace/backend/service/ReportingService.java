package com.lifetrace.backend.service;

import com.lifetrace.backend.repository.OrganRepository;
import com.lifetrace.backend.repository.RecipientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportingService {

    private final OrganRepository organRepository;
    private final RecipientRepository recipientRepository;

    public Map<String, Object> getAdminStats() {

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalOrgans", organRepository.count());
        stats.put("availableOrgans", organRepository.countByStatus("AVAILABLE"));
        stats.put("allocatedOrgans", organRepository.countByStatus("ALLOCATED"));

        stats.put("totalRecipients", recipientRepository.count());
        stats.put("waitingRecipients", recipientRepository.countByStatus("WAITING"));
        stats.put("matchedRecipients", recipientRepository.countByStatus("MATCHED"));

        return stats;
    }
}