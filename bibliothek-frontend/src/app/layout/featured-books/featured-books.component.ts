import { Component } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { Book } from 'src/app/core/models/book';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-featured-books',
  template: `<ng-container *ngIf="featuredBooks.length > 0">
    <article class="container">
      <h2>{{ 'PLATFORM.FEATURED' | translate }}</h2>
      <div class="featured">
        <a
          [routerLink]="['/platform/details', book.id]"
          class="featured-book"
          *ngFor="let book of featuredBooks"
        >
          <img
            class="book-cover"
            [src]="book.coverImage"
            alt="{{ book.title }}"
          />
          <h4 class="book-title">{{ book.title }}</h4>
          <p class="book-author">{{ book.author }}</p>
        </a>
      </div>
    </article>
  </ng-container>`,
  styleUrls: ['./featured-books.component.css'],
})
export class FeaturedBooksComponent {
  featuredBooks: Book[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly bookService: BookService) {
    this.bookService
      .getFeaturedBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((books) => {
        this.featuredBooks = books;
      });
  }
}
