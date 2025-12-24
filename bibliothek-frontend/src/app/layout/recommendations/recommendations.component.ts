import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Book } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-recommendations',
  template: `<div class="container" *ngIf="recommendations.length > 0">
    <h2 class="section-title">{{ 'PLATFORM.RECOMMENDED' | translate }}</h2>

    <div class="book-list">
      <div class="list-header">
        <p class="col-title">{{ 'BOOKS.TABLE.TITLE' | translate }}</p>
        <p class="col-publisher">{{ 'BOOKS.TABLE.PUBLISHER' | translate }}</p>
        <p class="col-genre">{{ 'BOOKS.TABLE.GENRE' | translate }}</p>
        <p class="col-details">{{ 'BOOKS.TABLE.DETAILS' | translate }}</p>
      </div>

      <a
        class="list-item"
        [routerLink]="['/platform/details', recommendation.id]"
        *ngFor="let recommendation of recommendations"
      >
        <div class="img-title-wrapper">
          <img
            class="book-cover"
            [src]="recommendation.coverImage"
            [alt]="recommendation.title"
          />
          <div>
            <h4 class="book-title">{{ recommendation.title }}</h4>
            <p class="book-author">{{ recommendation.author }}</p>
          </div>
        </div>

        <p class="col-publisher">{{ recommendation.publisher }}</p>
        <p class="col-genre">{{ recommendation.genre }}</p>

        <span class="btn-details">
          {{ 'BOOKS.BUTTONS.MORE_DETAILS' | translate }}
        </span>
      </a>
    </div>
  </div>`,
  styleUrls: ['./recommendations.component.css'],
})
export class RecommendationsComponent implements OnChanges {
  @Input() openBook?: Book;

  recommendations: Book[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly bookService: BookService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openBook'] && this.openBook) {
      this.getRecommendations();
    }
  }

  getRecommendations(): void {
    if (this.openBook) {
      this.bookService
        .getRecommendationsByGenre(this.openBook.genre)
        .pipe(takeUntil(this.destroy$))
        .subscribe((recommendations) => {
          this.recommendations = recommendations.filter(
            (book) => book.id !== this.openBook?.id
          );
        });
    }
  }
}
