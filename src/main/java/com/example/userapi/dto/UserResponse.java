package com.example.userapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private Integer age;
    private String place;
    private String contactNumber;
    private String department;
    private String designation;
    private String organization;
    private String employeeCode;
    private String dateOfJoining;
    private Long managerId;
    private String managerName;
    private String role;
    private String avatarUrl;
    private boolean isManager;
} 