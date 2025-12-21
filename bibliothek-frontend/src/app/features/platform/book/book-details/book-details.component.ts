import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BookService } from '../../../../core/services/book.service';
import { LoanService } from 'src/app/core/services/loan.service';
import { Book } from 'src/app/core/models/book';
import { AuthService } from 'src/app/core/services/auth.service';
import { Loan } from 'src/app/core/models/loan';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  book?: Book;
  bookId!: string;

  showInfo = true;
  showEdit = false;
  isButtonDisabled = false;
  loading = true;

  message = '';
  messageSuccess = false;
  messageError = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookService: BookService,
    private readonly router: Router,
    private readonly loanService: LoanService,
    private readonly authService: AuthService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.resetMessage();
    this.route.params.subscribe((params) => {
      this.bookId = params['bookId'];
      this.loadBook();
    });
  }

  loadBook() {
    this.bookService.getById(this.bookId).subscribe({
      next: (book) => {
        this.book = book;
        this.loading = false;
        this.checkLoanStatus();
      },
      error: (err) => {
        console.error('Book not found or invalid ID:', err);
        this.router.navigate(['/404'], { skipLocationChange: true });
      },
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  requestLoan(bookId: string) {
    const confirmMsg = this.translate.instant(
      'BOOK_DETAILS.MESSAGES.LOAN_CONFIRM'
    );
    if (!confirm(confirmMsg)) return;

    this.loanService.requestLoan(bookId).subscribe({
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

  checkLoanStatus() {
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

  deleteBook() {
    const confirmMsg = this.translate.instant(
      'BOOK_DETAILS.MESSAGES.DELETE_CONFIRM'
    );
    if (!confirm(confirmMsg)) return;

    if (this.book?.id) {
      this.bookService.delete(this.book.id).subscribe({
        next: () => {
          this.router.navigate(['/platform']);
        },
        error: (err) => {
          console.error(err);
          this.showMessage('BOOK_DETAILS.MESSAGES.DELETE_ERROR', true);
        },
      });
    }
  }

  showEditMode(enable: boolean) {
    this.showInfo = !enable;
    this.showEdit = enable;
    this.message = '';
  }

  onBookSaved() {
    this.showEditMode(false);
    this.loadBook();
  }

  private showMessage(key: string, isError: boolean) {
    this.message = key;
    this.messageSuccess = !isError;
    this.messageError = isError;
  }

  private resetMessage() {
    this.message = '';
    this.messageSuccess = false;
    this.messageError = false;
  }
}
