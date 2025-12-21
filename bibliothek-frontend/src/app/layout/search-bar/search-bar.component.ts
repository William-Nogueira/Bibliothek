import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-bar',
  template: `<form class="search-bar">
    <input
      class="bar"
      type="text"
      [(ngModel)]="searchQuery"
      name="titulo"
      [placeholder]="'SEARCH.PLACEHOLDER' | translate"
      (keyup.enter)="search()"
    />
    <button class="search-btn" type="button" (click)="search()">
      {{ 'SEARCH.BUTTON' | translate }}
    </button>
  </form> `,
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  searchQuery: string = '';

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {}

  search(): void {
    const trimmedQuery = this.searchQuery.trim();
    if (trimmedQuery.length < 3) {
      const errorMsg = this.translate.instant('SEARCH.ERROR_MIN_LENGTH');
      globalThis.alert(errorMsg);
      return;
    }

    this.router.navigate(['/platform'], {
      queryParams: { query: trimmedQuery },
    });
  }
}
