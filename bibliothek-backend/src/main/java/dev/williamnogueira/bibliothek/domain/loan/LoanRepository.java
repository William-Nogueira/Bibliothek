package dev.williamnogueira.bibliothek.domain.loan;

import dev.williamnogueira.bibliothek.domain.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LoanRepository extends JpaRepository<LoanEntity, UUID> {
    Page<LoanEntity> findByUser(UserEntity user, Pageable pageable);
}
