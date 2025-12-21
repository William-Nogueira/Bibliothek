package dev.williamnogueira.bibliothek.domain.loan.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InvalidLoanStateException extends ResponseStatusException {
    public InvalidLoanStateException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
