package dev.williamnogueira.bibliothek.domain.book;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
interface BookRepository extends JpaRepository<BookEntity, UUID>{
    List<BookEntity> findByFeaturedIsTrue();

    @Query("""
       SELECT b FROM Book b
       WHERE (:searchQuery IS NULL OR :searchQuery = ''
           OR upper(b.title) LIKE upper(concat('%', :searchQuery, '%'))
           OR upper(b.genre) LIKE upper(concat('%', :searchQuery, '%'))
           OR upper(b.author) LIKE upper(concat('%', :searchQuery, '%')))
       """)
    Page<BookEntity> filterBooks(@Param("searchQuery") String searchQuery, Pageable pageable);

    @Query("""
            SELECT b FROM Book b
            WHERE upper(b.genre) LIKE upper(?1)
            """)
    List<BookEntity> getRecommendationsByGenre(String genre, Pageable limitFive);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Book b WHERE b.id = :id")
    Optional<BookEntity> findBookWithPessimisticLock(UUID id);
}
