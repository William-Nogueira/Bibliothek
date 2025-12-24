import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-platform',
  template: `<main>
      <app-navbar></app-navbar>
      <app-search-bar></app-search-bar>
      <ng-container *ngIf="!hasSearchQuery">
        <app-featured-books></app-featured-books>
      </ng-container>
      <app-book-list [query]="query"></app-book-list>
    </main>
    <app-footer></app-footer> `,
  styleUrls: ['./platform.component.css'],
})
export class PlatformComponent {
  hasSearchQuery: boolean = false;
  query = '';

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly route: ActivatedRoute) {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.query = params['query'];
        this.hasSearchQuery = !!(this.query && this.query.trim().length > 0);
      });
  }
}
