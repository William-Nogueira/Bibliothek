package dev.williamnogueira.bibliothek.domain.loan.mapper;

import dev.williamnogueira.bibliothek.domain.loan.LoanEntity;
import dev.williamnogueira.bibliothek.domain.loan.dto.LoanResponseDto;
import lombok.experimental.UtilityClass;

@UtilityClass
public class LoanMapper {

    public static LoanResponseDto toDto(LoanEntity entity) {
        return new LoanResponseDto(
                entity.getId(),
                entity.getBook().getTitle(),
                entity.getUser().getRegistration(),
                entity.getUser().getName(),
                entity.getStatus(),
                entity.getRequestDate(),
                entity.getLoanDate(),
                entity.getReturnDate(),
                entity.getFine()
        );
    }
}