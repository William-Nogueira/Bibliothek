package dev.williamnogueira.bibliothek.domain.loan.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class LoanNotFoundException extends ResponseStatusException {
    public LoanNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}
