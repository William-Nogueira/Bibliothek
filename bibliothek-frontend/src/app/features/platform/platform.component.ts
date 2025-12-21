import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
export class PlatformComponent implements OnInit {
  hasSearchQuery: boolean = false;
  query = '';

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['query'];
      this.hasSearchQuery = !!(this.query && this.query.trim().length > 0);
    });
  }
}
