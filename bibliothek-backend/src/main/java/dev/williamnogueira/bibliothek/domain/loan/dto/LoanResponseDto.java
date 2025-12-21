package dev.williamnogueira.bibliothek.domain.loan.dto;

import dev.williamnogueira.bibliothek.domain.loan.LoanStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record LoanResponseDto(
        UUID id,
        String bookTitle,
        String userRegistration,
        String userName,
        LoanStatus status,
        Instant requestDate,
        Instant loanDate,
        Instant returnDate,
        BigDecimal fine
) {}