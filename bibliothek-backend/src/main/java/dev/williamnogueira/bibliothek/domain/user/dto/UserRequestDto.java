package dev.williamnogueira.bibliothek.domain.user.dto;

public record UserRequestDto(
        String registration,
        String name,
        String password,
        String profilePic) {
}
