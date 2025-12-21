package dev.williamnogueira.bibliothek.domain.auth.dto.register;

public record RegisterRequestDto(String registration, String name, String password, String roles) {
}
