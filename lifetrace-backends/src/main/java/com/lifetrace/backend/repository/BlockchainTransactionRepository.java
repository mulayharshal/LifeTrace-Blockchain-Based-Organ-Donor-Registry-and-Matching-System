package com.lifetrace.backend.repository;

import com.lifetrace.backend.model.BlockchainTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlockchainTransactionRepository
        extends JpaRepository<BlockchainTransaction, Long> {
}
