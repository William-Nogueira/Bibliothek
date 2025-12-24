package dev.williamnogueira.bibliothek.domain.loan;

import dev.williamnogueira.bibliothek.domain.book.BookEntity;
import dev.williamnogueira.bibliothek.domain.user.UserEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

interface LoanRepository extends JpaRepository<LoanEntity, UUID> {
    Page<LoanEntity> findByUser(UserEntity user, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Book b WHERE b.id = :id")
    Optional<BookEntity> findBookForUpdate(UUID id);
}
