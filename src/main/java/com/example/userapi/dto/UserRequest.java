package com.example.userapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UserRequest {
    private Long id;
    private String email;
    private String password;
    @NotBlank(message = "Name is mandatory")
    private String name;
    @Min(0)
    private Integer age;
    @NotBlank(message = "Place is mandatory")
    private String place;
    @NotBlank(message = "Contact number is mandatory")
    private String contactNumber;
    private String department;
    private String designation;
    private String organization;
    private String employeeCode;
    private String dateOfJoining;
    private Long managerId;
    private String role;
    private String avatarUrl;
} 