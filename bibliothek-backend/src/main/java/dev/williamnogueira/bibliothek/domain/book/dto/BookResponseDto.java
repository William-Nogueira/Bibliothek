package dev.williamnogueira.bibliothek.domain.book.dto;

import lombok.Builder;

@Builder
public record BookResponseDto(
        String id,
        String title,
        String genre,
        String author,
        String publisher,
        Integer stock,
        Integer availableStock,
        String coverImage,
        String description,
        Boolean featured
) {
}
