package com.lifetrace.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recipients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String organType;

    private String bloodGroup;

    @Column(nullable = false)
    private Integer age;

    private String gender;        // NEW

    private String location;      // NEW (Pune / Mumbai)

    private String urgencyLevel;  // NEW (LOW / MEDIUM / HIGH)

    private String status; // WAITING / MATCHED

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    @JsonIgnore
    private Hospital hospital;
}