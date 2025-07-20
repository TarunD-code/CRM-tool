package com.example.userapi.controller;

import com.example.userapi.dto.AuthRequest;
import com.example.userapi.dto.AuthResponse;
import com.example.userapi.entity.User;
import com.example.userapi.repository.UserRepository;
import com.example.userapi.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getName()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getName()));
    }
} 