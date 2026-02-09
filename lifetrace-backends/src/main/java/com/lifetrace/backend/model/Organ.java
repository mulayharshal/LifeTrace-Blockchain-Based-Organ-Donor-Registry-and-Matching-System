package com.lifetrace.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organ")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Organ {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String organType;
    private String bloodGroup;

    @Column(name = "organ_condition")
    private String condition;

    private String status;

    private Long donorId;

    // NEW MATCHING FIELDS
    private String location;
//    private String urgencyLevel;

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    @JsonIgnore
    private Recipient recipient;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    @JsonIgnore
    private Hospital hospital;
}