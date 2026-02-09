package com.lifetrace.backend.config;

import com.lifetrace.backend.blockchain.LifeTraceRegistryContract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;

@Configuration
public class Web3Config {

    @Value("${blockchain.rpc.url}")
    private String rpcUrl;

    @Value("${blockchain.contract.address}")
    private String contractAddress;

    @Value("${blockchain.private.key}")
    private String privateKey;

    // ===============================
    // Web3 instance
    // ===============================
    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(rpcUrl));
    }

    // ===============================
    // Wallet credentials
    // ===============================
    @Bean
    public Credentials credentials() {
        return Credentials.create(privateKey);
    }

    // ===============================
    // 🔥 FIXED GAS PROVIDER (CRITICAL)
    // ===============================
    @Bean
    public ContractGasProvider contractGasProvider() {
        return new ContractGasProvider() {

            @Override
            public BigInteger getGasPrice(String contractFunc) {
                // Ganache default gas price
                return BigInteger.valueOf(20_000_000_000L); // 20 Gwei
            }

            @Override
            public BigInteger getGasPrice() {
                return BigInteger.valueOf(20_000_000_000L);
            }

            @Override
            public BigInteger getGasLimit(String contractFunc) {
                // SAFE gas limit for Ganache
                return BigInteger.valueOf(3_000_000);
            }

            @Override
            public BigInteger getGasLimit() {
                return BigInteger.valueOf(3_000_000);
            }
        };
    }

    // ===============================
    // Contract Bean
    // ===============================
    @Bean
    public LifeTraceRegistryContract lifeTraceRegistryContract(
            Web3j web3j,
            Credentials credentials,
            ContractGasProvider gasProvider
    ) {
        return LifeTraceRegistryContract.load(
                contractAddress,
                web3j,
                credentials,
                gasProvider
        );
    }
}