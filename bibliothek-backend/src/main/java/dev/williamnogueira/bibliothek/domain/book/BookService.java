package dev.williamnogueira.bibliothek.domain.book;

import dev.williamnogueira.bibliothek.domain.book.dto.BookRequestDto;
import dev.williamnogueira.bibliothek.domain.book.dto.BookResponseDto;
import dev.williamnogueira.bibliothek.domain.book.exception.BookNotFoundException;
import dev.williamnogueira.bibliothek.domain.book.exception.BookStockException;
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
        return bookRepository.findByFeaturedIsTrue().stream()
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
        var entity = bookRepository.save(BookMapper.toEntity(book));
        log.info("Book created successfully with ID: {}", entity.getId());

        return BookMapper.toDto(entity);
    }

    @Transactional
    public BookResponseDto updateById(String id, BookRequestDto bookDto) {
        log.info("Updating book ID: {}", id);

        var book = getEntity(UUID.fromString(id));
        updateStockLogic(book, bookDto.stock());

        book.setTitle(bookDto.title());
        book.setAuthor(bookDto.author());
        book.setGenre(bookDto.genre());
        book.setPublisher(bookDto.publisher());
        book.setDescription(bookDto.description());
        book.setCoverImage(bookDto.coverImage());
        book.setFeatured(bookDto.featured());

        return BookMapper.toDto(bookRepository.save(book));
    }

    @Transactional
    public void deleteById(String id) {
        log.info("Requesting deletion of book ID: {}", id);
        var book = getEntity(UUID.fromString(id));

        if (book.getAvailableStock() < book.getStock()) {
            int rentedCount = book.getStock() - book.getAvailableStock();
            throw new BookStockException("Cannot delete book. " + rentedCount + " copies are currently rented out.");
        }

        bookRepository.delete(book);
        log.info("Book ID: {} deleted successfully", id);
    }

    @Transactional
    public void incrementAvailableStock(BookEntity book) {
        book.setAvailableStock(book.getAvailableStock() + 1);
        bookRepository.save(book);
    }

    public BookEntity getEntity(UUID id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found"));
    }

    public BookEntity findBookWithPessimisticLock(UUID id) {
        return bookRepository.findBookWithPessimisticLock(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found"));
    }

    private void updateStockLogic(BookEntity book, Integer newTotalStock) {
        if (Objects.isNull(newTotalStock) || Objects.equals(newTotalStock, book.getStock())) {
            return;
        }

        int stockDifference = newTotalStock - book.getStock();
        int newAvailable = book.getAvailableStock() + stockDifference;

        if (newAvailable < 0) {
            int rentedCount = book.getStock() - book.getAvailableStock();
            throw new BookStockException("Cannot reduce stock to " + newTotalStock + ". " + rentedCount + " books are currently rented out.");
        }

        log.info("Stock adjusted. Old: {}, New: {}, Available Diff: {}", book.getStock(), newTotalStock, stockDifference);

        book.setStock(newTotalStock);
        book.setAvailableStock(newAvailable);
    }
}
