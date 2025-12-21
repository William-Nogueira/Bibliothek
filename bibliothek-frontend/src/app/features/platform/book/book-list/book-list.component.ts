import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BookService } from '../../../../core/services/book.service';
import { Book } from 'src/app/core/models/book';
import { Page } from 'src/app/core/models/page';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnChanges {
  @Input() query = '';

  pagedResult?: Page<Book>;
  books?: Book[];

  currentPage = 0;
  readonly pageSize = 8;
  totalPages = 1;

  loading = true;

  constructor(private readonly bookService: BookService) {
    this.getFilteredBooks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['query'] && !changes['query'].firstChange) {
      this.currentPage = 0;
      this.getFilteredBooks();
    }
  }

  getFilteredBooks(): void {
    this.loading = true;

    this.bookService
      .filterBooks(this.query, this.currentPage, this.pageSize)
      .subscribe({
        next: (pagedResult) => {
          this.pagedResult = pagedResult;
          this.books = pagedResult.content;
          this.totalPages = pagedResult.page.totalPages;

          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getFilteredBooks();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getFilteredBooks();
    }
  }
}
