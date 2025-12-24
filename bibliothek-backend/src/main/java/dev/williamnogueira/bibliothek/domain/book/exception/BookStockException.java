package dev.williamnogueira.bibliothek.domain.book.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class BookStockException extends ResponseStatusException {
    public BookStockException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
