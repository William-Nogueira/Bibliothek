package dev.williamnogueira.bibliothek.domain.loan;

import dev.williamnogueira.bibliothek.domain.user.UserEntity;
import dev.williamnogueira.bibliothek.domain.book.BookEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity(name = "Loan")
@Table(name = "loan")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private BookEntity book;

    @ManyToOne
    @JoinColumn(name = "user_registration", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    @Column(nullable = false)
    private Instant requestDate;

    @Column
    private Instant loanDate;

    @Column
    private Instant returnDate;

    @Column(nullable = false)
    private BigDecimal fine;
}
