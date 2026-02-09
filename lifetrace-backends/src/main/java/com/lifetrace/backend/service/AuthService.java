package com.lifetrace.backend.service;

import com.lifetrace.backend.config.JwtUtil;
import com.lifetrace.backend.dto.LoginRequest;
import com.lifetrace.backend.dto.RegisterRequest;
import com.lifetrace.backend.exception.BadRequestException;
import com.lifetrace.backend.exception.ResourceNotFoundException;
import com.lifetrace.backend.exception.UnauthorizedException;
import com.lifetrace.backend.model.Role;
import com.lifetrace.backend.model.User;
import com.lifetrace.backend.repository.RoleRepository;
import com.lifetrace.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Role role = roleRepository
                .findByName("ROLE_" + request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of(role));

        userRepository.save(user);
        return "Registered successfully";
    }

    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String role = user.getRoles().iterator().next().getName();

        return jwtUtil.generateToken(user.getEmail(), role);
    }
}