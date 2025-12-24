package dev.williamnogueira.bibliothek.domain.book;

import dev.williamnogueira.bibliothek.domain.book.dto.BookRequestDto;
import dev.williamnogueira.bibliothek.domain.book.dto.BookResponseDto;
import lombok.experimental.UtilityClass;

import java.util.Objects;
import java.util.UUID;

import static java.util.Objects.isNull;

@UtilityClass
class BookMapper {

    static BookResponseDto toDto(BookEntity bookEntity) {
        if (isNull(bookEntity)) {
            return null;
        }
        return BookResponseDto.builder()
                .id(String.valueOf(bookEntity.getId()))
                .title(bookEntity.getTitle())
                .author(bookEntity.getAuthor())
                .genre(bookEntity.getGenre())
                .publisher(bookEntity.getPublisher())
                .stock(bookEntity.getStock())
                .availableStock(bookEntity.getAvailableStock())
                .coverImage(bookEntity.getCoverImage())
                .description(bookEntity.getDescription())
                .featured(bookEntity.getFeatured())
                .build();
    }

    static BookEntity toEntity(BookRequestDto book) {
        var builder = BookEntity.builder();

        if (Objects.nonNull(book.id())) {
            builder.id(UUID.fromString(book.id()));
        }

        return builder.title(book.title())
                .author(book.author())
                .genre(book.genre())
                .publisher(book.publisher())
                .stock(book.stock())
                .availableStock(book.availableStock())
                .coverImage(book.coverImage())
                .description(book.description())
                .featured(book.featured())
                .build();
    }
}
