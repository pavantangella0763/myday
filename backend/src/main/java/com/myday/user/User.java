package com.myday.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Application user. Table is named "users" because "user" is a reserved word in many databases.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    /** BCrypt hash — never stored or returned as plain text. */
    @Column(nullable = false)
    private String password;

    @Column(name = "display_name")
    private String displayName;

    /** Optional monthly spending budget used for expense alerts. Null = no budget set. */
    @Column(name = "monthly_budget", precision = 10, scale = 2)
    private BigDecimal monthlyBudget;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
