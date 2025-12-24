import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BookService } from '../../../../core/services/book.service';
import { LoanService } from 'src/app/core/services/loan.service';
import { Book } from 'src/app/core/models/book';
import { AuthService } from 'src/app/core/services/auth.service';
import { Loan } from 'src/app/core/models/loan';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent {
  book?: Book;
  bookId!: string;

  showInfo = true;
  showEdit = false;
  isButtonDisabled = false;
  loading = true;

  message = '';
  messageSuccess = false;
  messageError = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookService: BookService,
    private readonly router: Router,
    private readonly loanService: LoanService,
    private readonly authService: AuthService,
    private readonly translate: TranslateService
  ) {
    this.resetMessage();
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.bookId = params['bookId'];
      this.loadBook();
    });
  }

  loadBook(): void {
    this.bookService
      .getById(this.bookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (book) => {
          this.book = book;
          this.loading = false;
          this.checkLoanStatus();
        },
        error: (err) => {
          console.error(err);
          this.router.navigate(['/404'], { skipLocationChange: true });
        },
      });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  requestLoan(bookId: string): void {
    const confirmMsg = this.translate.instant(
      'BOOK_DETAILS.MESSAGES.LOAN_CONFIRM'
    );

    if (!confirm(confirmMsg)) {
      return;
    }

    this.loanService
      .requestLoan(bookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showMessage('BOOK_DETAILS.MESSAGES.LOAN_SUCCESS', false);
          if (this.book) {
            this.book.availableStock--;
            this.isButtonDisabled = true;
          }
        },
        error: (err) => {
          console.error(err);
          this.showMessage('BOOK_DETAILS.MESSAGES.LOAN_ERROR', true);
        },
      });
  }

  checkLoanStatus(): void {
    this.loanService.getUserLoans().subscribe((loans) => {
      const list = loans.content;

      const hasActiveLoan = list.some(
        (loan: Loan) =>
          loan.bookTitle === this.book?.title && loan.status !== 'FINISHED'
      );

      if (hasActiveLoan) {
        this.isButtonDisabled = true;
      }
    });
  }

  deleteBook(): void {
    const confirmMsg = this.translate.instant(
      'BOOK_DETAILS.MESSAGES.DELETE_CONFIRM'
    );

    if (!confirm(confirmMsg)) {
      return;
    }

    if (this.book?.id) {
      this.bookService
        .delete(this.book.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.router.navigate(['/platform']),
          error: (err) => {
            console.error(err);
            this.showMessage('BOOK_DETAILS.MESSAGES.DELETE_ERROR', true);
          },
        });
    }
  }

  showEditMode(enable: boolean): void {
    this.showInfo = !enable;
    this.showEdit = enable;
    this.message = '';
  }

  onBookSaved(): void {
    this.showEditMode(false);
    this.loadBook();
    this.showMessage('BOOK_DETAILS.MESSAGES.EDIT_SUCCESS', false);
  }

  private showMessage(key: string, isError: boolean): void {
    this.message = key;
    this.messageSuccess = !isError;
    this.messageError = isError;
    setTimeout(() => (this.message = ''), 5000);
  }

  private resetMessage(): void {
    this.message = '';
    this.messageSuccess = false;
    this.messageError = false;
  }
}
