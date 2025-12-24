package dev.williamnogueira.bibliothek.domain.auth.dto.login;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto(
        @NotBlank
        String registration,
        @NotBlank
        String password
) {
}
