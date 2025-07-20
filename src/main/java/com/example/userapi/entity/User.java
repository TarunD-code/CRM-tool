package com.example.userapi.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "users")
@Data // Includes @Getter, @Setter, @ToString, @EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;
    private Integer age;
    private String place;
    private String contactNumber;

    private String department;
    private String designation;
    private String organization;
    private String employeeCode;
    private java.time.LocalDate dateOfJoining;

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.JoinColumn(name = "manager_id")
    private User manager;

    // New fields for CRM enhancements
    private String role; // e.g., Admin, Sales, Support, User
    private String avatarUrl; // URL or path to profile picture
} 