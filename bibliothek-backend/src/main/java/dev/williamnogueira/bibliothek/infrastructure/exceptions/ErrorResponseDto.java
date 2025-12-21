package dev.williamnogueira.bibliothek.infrastructure.exceptions;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ErrorResponseDto(
        LocalDateTime timestamp,
        Integer status,
        String error,
        String message,
        String path
) {}
