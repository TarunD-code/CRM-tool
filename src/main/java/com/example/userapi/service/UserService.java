package com.example.userapi.service;

import com.example.userapi.dto.UserRequest;
import com.example.userapi.dto.UserResponse;
import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest userRequest);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(Long id, UserRequest userRequest);
    void deleteUser(Long id);
} 