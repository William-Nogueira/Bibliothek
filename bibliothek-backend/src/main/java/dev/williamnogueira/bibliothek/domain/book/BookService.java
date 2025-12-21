package dev.williamnogueira.bibliothek.domain.book;

import dev.williamnogueira.bibliothek.domain.book.dto.BookRequestDto;
import dev.williamnogueira.bibliothek.domain.book.dto.BookResponseDto;
import dev.williamnogueira.bibliothek.domain.book.exception.BookNotFoundException;
import dev.williamnogueira.bibliothek.domain.book.mapper.BookMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {

    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public BookResponseDto findById(String id) {
        var book = getEntity(UUID.fromString(id));
        return BookMapper.toDto(book);
    }

    @Transactional(readOnly = true)
    public Page<BookResponseDto> findAllWithFilter(String searchQuery, Pageable pageable) {
        return bookRepository.filterBooks(searchQuery, pageable).map(BookMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<BookResponseDto> getFeaturedBooks() {
        List<BookEntity> featuredBooks = bookRepository.findByFeaturedIsTrue();
        if (featuredBooks.isEmpty()) {
            throw new BookNotFoundException("No featured books found.");
        }
        return featuredBooks.stream()
                .map(BookMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookResponseDto> getRecommendationsByGenre(String genre) {
        var limitFive = PageRequest.of(0, 5);
        return bookRepository.getRecommendationsByGenre(genre, limitFive)
                .stream()
                .map(BookMapper::toDto)
                .toList();
    }

    @Transactional
    public BookResponseDto create(BookRequestDto book) {
        log.info("Creating new book: '{}' by '{}'", book.title(), book.author());
        var entity = bookRepository.saveAndFlush(BookMapper.toEntity(book));
        log.info("Book created successfully with ID: {}", entity.getId());

        return BookMapper.toDto(entity);
    }

    @Transactional
    public BookResponseDto updateById(String id, @Valid BookRequestDto bookDto) {
        log.info("Updating book ID: {}", id);
        var existingBook = getEntity(UUID.fromString(id));
        var bookToSave = BookMapper.toEntity(bookDto);
        bookToSave.setId(existingBook.getId());

        int currentAvailable = existingBook.getAvailableStock();

        if (!Objects.equals(bookDto.stock(), existingBook.getStock())) {
            int stockDifference = bookDto.stock() - existingBook.getStock();
            currentAvailable += stockDifference;

            log.info("Stock adjusted. Old Total: {}, New Total: {}, Available Diff: {}",
                    existingBook.getStock(), bookDto.stock(), stockDifference);
        }

        bookToSave.setAvailableStock(currentAvailable);

        return BookMapper.toDto(bookRepository.save(bookToSave));
    }

    @Transactional
    public void deleteById(String id) {
        log.info("Requesting deletion of book ID: {}", id);
        var book = getEntity(UUID.fromString(id));
        bookRepository.delete(book);
        log.info("Book ID: {} deleted successfully", id);
    }

    public BookEntity getEntity(UUID id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found"));
    }
}
