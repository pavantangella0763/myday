package com.myday.user;

import com.myday.user.dto.ProfileResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProfileResponse getProfile(Long userId) {
        return toResponse(getUser(userId));
    }

    public ProfileResponse updateBudget(Long userId, BigDecimal monthlyBudget) {
        User user = getUser(userId);
        user.setMonthlyBudget(monthlyBudget);
        return toResponse(userRepository.save(user));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private ProfileResponse toResponse(User u) {
        return new ProfileResponse(u.getEmail(), u.getDisplayName(), u.getMonthlyBudget());
    }
}
