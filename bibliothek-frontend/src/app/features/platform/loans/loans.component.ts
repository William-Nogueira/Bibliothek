import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { Loan } from 'src/app/core/models/loan';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
})
export class LoansComponent {
  loans: Loan[] = [];

  currentPage = 0;
  totalPages = 1;
  loading = true;

  message = '';
  messageSuccess = false;
  messageError = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly loanService: LoanService,
    private readonly translate: TranslateService
  ) {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.loanService
      .getAllLoans(this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loans = response.content;
          this.totalPages = response.page.totalPages;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.showMessage('LOANS.MESSAGES.LOAD_ERROR', true);
          this.loading = false;
        },
      });
  }

  approveLoan(loanId: string): void {
    this.loanService
      .approveLoan(loanId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showMessage('LOANS.MESSAGES.APPROVE_SUCCESS', false);
          this.loadLoans();
        },
        error: (err) => {
          console.error(err);
          this.showMessage('LOANS.MESSAGES.APPROVE_ERROR', true);
        },
      });
  }

  finishLoan(loanId: string): void {
    this.loanService
      .finishLoan(loanId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showMessage('LOANS.MESSAGES.FINISH_SUCCESS', false);
          this.loadLoans();
        },
        error: (err) => {
          console.error(err);
          this.showMessage('LOANS.MESSAGES.FINISH_ERROR', true);
        },
      });
  }

  renewLoan(loanId: string): void {
    const confirmMsg = this.translate.instant('LOANS.MESSAGES.RENEW_CONFIRM');

    if (!confirm(confirmMsg)) {
      return;
    }

    this.loanService
      .renewLoan(loanId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showMessage('LOANS.MESSAGES.RENEW_SUCCESS', false);
          this.loadLoans();
        },
        error: (err) => {
          console.error(err);
          this.showMessage('LOANS.MESSAGES.RENEW_ERROR', true);
        },
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadLoans();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadLoans();
    }
  }

  private showMessage(key: string, isError: boolean): void {
    this.message = key;
    this.messageError = isError;
    this.messageSuccess = !isError;
    setTimeout(() => {
      this.message = '';
      this.messageError = false;
      this.messageSuccess = false;
    }, 5000);
  }
}
