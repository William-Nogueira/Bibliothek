package dev.williamnogueira.bibliothek.domain.auth.dto.register;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequestDto(
        @NotBlank
        String registration,
        @NotBlank
        String name,
        @NotBlank
        String password,
        @NotBlank
        String roles
) {
}
