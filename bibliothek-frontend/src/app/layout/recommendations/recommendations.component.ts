import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Book } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css'],
})
export class RecommendationsComponent implements OnChanges {
  @Input() openBook?: Book;

  recommendations: Book[] = [];

  constructor(private readonly bookService: BookService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openBook'] && this.openBook) {
      this.getRecommendations();
    }
  }

  getRecommendations() {
    if (this.openBook) {
      this.bookService
        .getRecommendationsByGenre(this.openBook.genre)
        .subscribe((recommendations) => {
          this.recommendations = recommendations.filter(
            (book) => book.id !== this.openBook?.id
          );
        });
    }
  }
}
