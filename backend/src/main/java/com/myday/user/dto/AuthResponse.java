package com.myday.user.dto;

/** Returned after successful register/login. Contains the JWT the frontend stores and sends back. */
public record AuthResponse(String token, String email, String displayName) {}
