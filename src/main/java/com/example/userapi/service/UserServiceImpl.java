package com.example.userapi.service;

import com.example.userapi.dto.UserRequest;
import com.example.userapi.dto.UserResponse;
import com.example.userapi.entity.User;
import com.example.userapi.exception.ResourceNotFoundException;
import com.example.userapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        User manager = null;
        if (userRequest.getManagerId() != null) {
            if (userRequest.getManagerId().equals(userRequest.getId())) {
                throw new IllegalArgumentException("User cannot be their own manager.");
            }
            manager = userRepository.findById(userRequest.getManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + userRequest.getManagerId()));
        }
        User user = User.builder()
                .name(userRequest.getName())
                .age(userRequest.getAge())
                .place(userRequest.getPlace())
                .contactNumber(userRequest.getContactNumber())
                .department(userRequest.getDepartment())
                .designation(userRequest.getDesignation())
                .organization(userRequest.getOrganization())
                .employeeCode(userRequest.getEmployeeCode())
                .dateOfJoining(parseDate(userRequest.getDateOfJoining()))
                .manager(manager)
                .email(userRequest.getEmail())
                .role(userRequest.getRole())
                .avatarUrl(userRequest.getAvatarUrl())
                .build();
        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        boolean isManager = userRepository.existsByManagerId(user.getId());
        return toResponse(user, isManager);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(user -> toResponse(user, userRepository.existsByManagerId(user.getId())))
            .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        User manager = null;
        if (userRequest.getManagerId() != null) {
            if (userRequest.getManagerId().equals(id)) {
                throw new IllegalArgumentException("User cannot be their own manager.");
            }
            manager = userRepository.findById(userRequest.getManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + userRequest.getManagerId()));
        }
        user.setName(userRequest.getName());
        user.setAge(userRequest.getAge());
        user.setPlace(userRequest.getPlace());
        user.setContactNumber(userRequest.getContactNumber());
        user.setDepartment(userRequest.getDepartment());
        user.setDesignation(userRequest.getDesignation());
        user.setOrganization(userRequest.getOrganization());
        user.setEmployeeCode(userRequest.getEmployeeCode());
        user.setDateOfJoining(parseDate(userRequest.getDateOfJoining()));
        user.setManager(manager);
        user.setRole(userRequest.getRole());
        user.setAvatarUrl(userRequest.getAvatarUrl());
        User updatedUser = userRepository.save(user);
        return toResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        if (userRepository.existsByManagerId(id)) {
            throw new IllegalStateException("Cannot delete user: This user is a manager for other users. Reassign or remove subordinates first.");
        }
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User user, boolean isManager) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getAge(),
                user.getPlace(),
                user.getContactNumber(),
                user.getDepartment(),
                user.getDesignation(),
                user.getOrganization(),
                user.getEmployeeCode(),
                user.getDateOfJoining() != null ? user.getDateOfJoining().toString() : null,
                user.getManager() != null ? user.getManager().getId() : null,
                user.getManager() != null ? user.getManager().getName() : null,
                user.getRole(),
                user.getAvatarUrl(),
                isManager
        );
    }

    private UserResponse toResponse(User user) {
        boolean isManager = userRepository.existsByManagerId(user.getId());
        return toResponse(user, isManager);
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) return null;
        return LocalDate.parse(dateStr);
    }
} 