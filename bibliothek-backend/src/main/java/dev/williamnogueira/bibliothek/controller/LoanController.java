package dev.williamnogueira.bibliothek.controller;

import dev.williamnogueira.bibliothek.domain.loan.LoanService;
import dev.williamnogueira.bibliothek.domain.loan.dto.LoanResponseDto;
import dev.williamnogueira.bibliothek.domain.user.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;

    @GetMapping
    public ResponseEntity<Page<LoanResponseDto>> findAllPaginated(Pageable pageable) {
        return ResponseEntity.ok(loanService.findAll(pageable));
    }

    @GetMapping("/user/{registration}")
    public ResponseEntity<Page<LoanResponseDto>> findByUser(@PathVariable String registration, Pageable pageable) {
        return ResponseEntity.ok(loanService.findByUser(registration, pageable));
    }

    @PostMapping("/request/{bookId}")
    public ResponseEntity<Void> requestLoan(@PathVariable UUID bookId,
                                            @AuthenticationPrincipal UserEntity user) {
        loanService.requestLoan(bookId, user.getRegistration());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{loanId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approveLoan(@PathVariable UUID loanId) {
        loanService.approveLoan(loanId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{loanId}/finish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> finishLoan(@PathVariable UUID loanId) {
        loanService.finishLoan(loanId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{loanId}/renew")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> renewLoan(@PathVariable UUID loanId) {
        loanService.renewLoan(loanId);
        return ResponseEntity.ok().build();
    }
}
