package com.myday.user.dto;

import java.math.BigDecimal;

public record ProfileResponse(String email, String displayName, BigDecimal monthlyBudget) {}
