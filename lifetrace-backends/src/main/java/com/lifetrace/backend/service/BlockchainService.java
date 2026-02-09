package com.lifetrace.backend.service;

import com.lifetrace.backend.blockchain.LifeTraceRegistryContract;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.web3j.abi.datatypes.Type;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.math.BigInteger;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlockchainService {

    private final LifeTraceRegistryContract contract;

    // ===============================
    // STORE ORGAN ALLOCATION
    // ===============================
    public TransactionReceipt storeOrganAllocation(
            Long organId,
            Long donorId,
            Long hospitalId
    ) {
        try {
            return contract.storeOrganAllocation(
                    BigInteger.valueOf(organId),
                    BigInteger.valueOf(donorId),
                    BigInteger.valueOf(hospitalId)
            );
        } catch (Exception e) {
            throw new RuntimeException("Blockchain allocation failed", e);
        }
    }

    // ===============================
    // STORE DONOR CONSENT
    // ===============================
    public TransactionReceipt storeDonorConsent(
            Long donorId,
            String ipfsHash
    ) {
        try {
            return contract.storeDonorConsent(
                    BigInteger.valueOf(donorId),
                    ipfsHash
            );
        } catch (Exception e) {
            throw new RuntimeException("Blockchain donor consent failed", e);
        }
    }

    // ===============================
    // READ DONOR CONSENT
    // ===============================
    public String getDonorConsentHash(Long donorId) {
        try {
            List<Type> result = contract.getDonorConsent(
                    BigInteger.valueOf(donorId)
            );

            return result.get(0).getValue().toString();
        } catch (Exception e) {
            throw new RuntimeException("Blockchain read failed", e);
        }
    }

    // ===============================
    // READ ORGAN ALLOCATION
    // ===============================
    public List<Type> getOrganAllocation(Long organId) {
        try {
            return contract.getOrganAllocation(
                    BigInteger.valueOf(organId)
            );
        } catch (Exception e) {
            throw new RuntimeException("Blockchain allocation read failed", e);
        }
    }
}