import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { Loan } from 'src/app/core/models/loan';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
})
export class LoansComponent implements OnInit {
  loans: Loan[] = [];

  currentPage = 0;
  totalPages = 1;
  totalElements = 0;
  loading = true;

  message = '';
  messageSuccess = false;
  messageError = false;

  constructor(
    private readonly loanService: LoanService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.loanService.getAllLoans(this.currentPage).subscribe({
      next: (response) => {
        this.loans = response.content;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading loans:', error);
        this.showMessage('LOANS.MESSAGES.LOAD_ERROR', true);
        this.loading = false;
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

  approveLoan(loanId: string): void {
    this.loanService.approveLoan(loanId).subscribe({
      next: () => {
        this.showMessage('LOANS.MESSAGES.APPROVE_SUCCESS', false);
        this.loadLoans();
      },
      error: () => this.showMessage('LOANS.MESSAGES.APPROVE_ERROR', true),
    });
  }

  finishLoan(loanId: string): void {
    this.loanService.finishLoan(loanId).subscribe({
      next: () => {
        this.showMessage('LOANS.MESSAGES.FINISH_SUCCESS', false);
        this.loadLoans();
      },
      error: () => this.showMessage('LOANS.MESSAGES.FINISH_ERROR', true),
    });
  }

  renewLoan(loanId: string): void {
    const confirmMsg = this.translate.instant('LOANS.MESSAGES.RENEW_CONFIRM');

    if (!confirm(confirmMsg)) {
      return;
    }
    this.loanService.renewLoan(loanId).subscribe({
      next: () => {
        this.showMessage('LOANS.MESSAGES.RENEW_SUCCESS', false);
        this.loadLoans();
      },
      error: () => this.showMessage('LOANS.MESSAGES.RENEW_ERROR', true),
    });
  }

  private showMessage(key: string, isError: boolean): void {
    this.message = key;
    this.messageError = isError;
    this.messageSuccess = !isError;
    setTimeout(() => {
      this.message = '';
      this.messageError = false;
      this.messageSuccess = false;
    }, 4000);
  }
}
