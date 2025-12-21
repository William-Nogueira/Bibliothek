import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  template: `
    <main class="container-404">
      <h1>404</h1>
      <h2>{{ 'NOT_FOUND.TITLE' | translate }}</h2>
      <p>{{ 'NOT_FOUND.MESSAGE' | translate }}</p>
      <button class="button" (click)="goHome()">
        {{ 'NOT_FOUND.BUTTON' | translate }}
      </button>
    </main>
  `,
  styleUrls: ['not-found.component.css'],
})
export class NotFoundComponent {
  constructor(private readonly router: Router) {}

  goHome() {
    this.router.navigate(['/platform']);
  }
}
