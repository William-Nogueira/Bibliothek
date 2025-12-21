package dev.williamnogueira.bibliothek.domain.book.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Builder;

@Builder
public record BookRequestDto(
        String id,
        @NotBlank
        String title,
        @NotBlank
        String genre,
        @NotBlank
        String author,
        @NotBlank
        String publisher,
        @PositiveOrZero
        Integer stock,
        @PositiveOrZero
        Integer availableStock,
        String coverImage,
        @NotBlank
        String description,
        Boolean featured
) {
}
