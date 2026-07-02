package com.myday.user;

import com.myday.security.UserPrincipal;
import com.myday.user.dto.BudgetRequest;
import com.myday.user.dto.ProfileResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ProfileResponse getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return profileService.getProfile(principal.getId());
    }

    @PutMapping("/budget")
    public ProfileResponse updateBudget(@AuthenticationPrincipal UserPrincipal principal,
                                        @Valid @RequestBody BudgetRequest request) {
        return profileService.updateBudget(principal.getId(), request.monthlyBudget());
    }
}
