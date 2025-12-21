package dev.williamnogueira.bibliothek.domain.loan;

import dev.williamnogueira.bibliothek.domain.book.BookService;
import dev.williamnogueira.bibliothek.domain.loan.dto.LoanResponseDto;
import dev.williamnogueira.bibliothek.domain.loan.exceptions.BookNotAvailableException;
import dev.williamnogueira.bibliothek.domain.loan.exceptions.InvalidLoanStateException;
import dev.williamnogueira.bibliothek.domain.loan.exceptions.LoanNotFoundException;
import dev.williamnogueira.bibliothek.domain.loan.mapper.LoanMapper;
import dev.williamnogueira.bibliothek.domain.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookService bookService;
    private final UserService userService;

    private static final BigDecimal FINE_PER_DAY = new BigDecimal("1.00");
    private static final int LOAN_DAYS = 14;

    @Transactional(readOnly = true)
    public Page<LoanResponseDto> findAll(Pageable pageable) {
        return loanRepository.findAll(pageable).map(LoanMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<LoanResponseDto> findByUser(String registration, Pageable pageable) {
        var user = userService.getEntity(registration);
        return loanRepository.findByUser(user, pageable).map(LoanMapper::toDto);
    }

    @Transactional
    public void requestLoan(UUID bookId, String userRegistration) {
        log.info("Loan request initiated. User: {}, Book: {}", userRegistration, bookId);
        var book = bookService.getEntity(bookId);

        if (book.getAvailableStock() <= 0) {
            throw new BookNotAvailableException("No stock available for this book");
        }

        var user = userService.getEntity(userRegistration);

        var loan = LoanEntity.builder()
                .book(book)
                .user(user)
                .status(LoanStatus.PENDING)
                .requestDate(Instant.now())
                .fine(BigDecimal.ZERO)
                .build();

        book.setAvailableStock(book.getAvailableStock() - 1);

        var savedLoan = loanRepository.saveAndFlush(loan);
        log.info("Loan requested successfully. Loan ID: {}", savedLoan.getId());
    }

    @Transactional
    public void approveLoan(UUID loanId) {
        log.info("Attempting to approve Loan ID: {}", loanId);
        var loan = getEntity(loanId);

        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new InvalidLoanStateException("Loan is not pending");
        }

        loan.setStatus(LoanStatus.ACTIVE);
        loan.setLoanDate(Instant.now());
        loan.setReturnDate(Instant.now().plus(LOAN_DAYS, ChronoUnit.DAYS));

        loanRepository.save(loan);
        log.info("Loan ID {} approved. Due date: {}", loanId, loan.getReturnDate());
    }

    @Transactional
    public void finishLoan(UUID loanId) {
        log.info("Attempting to finish Loan ID: {}", loanId);
        var loan = getEntity(loanId);

        var book = loan.getBook();
        book.setAvailableStock(book.getAvailableStock() + 1);

        if (Instant.now().isAfter(loan.getReturnDate())) {
            long daysLate = Duration.between(loan.getReturnDate(), Instant.now()).toDays();
            var calculatedFine = FINE_PER_DAY.multiply(BigDecimal.valueOf(daysLate));
            loan.setFine(calculatedFine);

            log.info("Loan ID {} is late by {} days. Fine applied: {}", loanId, daysLate, calculatedFine);
        }

        loan.setStatus(LoanStatus.FINISHED);
        loanRepository.save(loan);
        log.info("Loan ID {} successfully finished.", loanId);
    }

    @Transactional
    public void renewLoan(UUID loanId) {
        log.info("Attempting to renew Loan ID: {}", loanId);
        var loan = getEntity(loanId);

        if (loan.getStatus() == LoanStatus.PENDING || loan.getStatus() == LoanStatus.FINISHED) {
            throw new InvalidLoanStateException("Cannot renew a loan that is Pending or Finished");
        }

        var newReturnDate = loan.getReturnDate().plus(14, ChronoUnit.DAYS);
        loan.setReturnDate(newReturnDate);

        loan.setStatus(LoanStatus.RENEWED);

        loanRepository.save(loan);
        log.info("Loan ID {} renewed. New return date: {}", loanId, newReturnDate);
    }

    private LoanEntity getEntity(UUID id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException("Loan not found"));
    }
}
