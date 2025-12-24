import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `<header>
    <div class="container-nav">
      <nav>
        <div class="div-logo">
          <a [routerLink]="['/platform']"
            ><img
              class="logo"
              src="../../../assets/logo.png"
              alt="Bibliothek Logo"
          /></a>
          <a [routerLink]="['/platform']" class="nav-link-books">
            {{ 'NAV.BOOKS' | translate }}
          </a>
          <div
            class="nav-dropdown"
            *ngIf="isAdmin()"
            (mouseenter)="openDropdown()"
            (mouseleave)="startCloseTimer()"
          >
            <a class="nav-link-books dropdown-toggle"
              >Admin
              <img
                src="../../../assets/svg/arrow-down.svg"
                class="icon"
                alt="Open menu"
            /></a>
            <div
              class="dropdown-menu"
              *ngIf="isDropdownOpen"
              (mouseenter)="openDropdown()"
            >
              <a class="dropdown-item" [routerLink]="['/platform/loans']">
                {{ 'NAV.LOANS' | translate }}
              </a>
              <a class="dropdown-item" [routerLink]="['/platform/newBook']">
                {{ 'NAV.REGISTER_BOOK' | translate }}
              </a>
              <a class="dropdown-item" [routerLink]="['/platform/newUser']">
                {{ 'NAV.REGISTER_USER' | translate }}
              </a>
            </div>
          </div>
        </div>

        <ul class="nav-list">
          <li class="nav-item">
            <a
              [routerLink]="['/platform/user', getMatricula()]"
              class="nav-link"
            >
              <img class="profile-pic" [src]="getProfilePic()" alt="Profile" />
              {{ getCurrentUserName() }}
            </a>
            <a class="icon-link" [routerLink]="['/']" (click)="logout()"
              ><img src="../../../assets/svg/logout.svg" class="icon" alt="Logout"
            /></a>
          </li>
        </ul>
      </nav>
    </div>
  </header> `,
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isDropdownOpen = false;
  closeTimer: any;

  constructor(private readonly authService: AuthService) {}

  openDropdown() {
    this.isDropdownOpen = true;
    this.cancelCloseTimer();
  }

  startCloseTimer(): void {
    this.closeTimer = setTimeout(() => {
      this.isDropdownOpen = false;
    }, 500);
  }

  cancelCloseTimer(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  getCurrentUserName(): string {
    return localStorage.getItem('name') || '';
  }

  getMatricula(): string {
    return localStorage.getItem('registration') || '';
  }

  getProfilePic(): string {
    const profilePic: string = localStorage.getItem('profilePic') ?? 'null';
    if (profilePic === 'null') {
      return '../../../assets/profile-picture.png';
    }
    return profilePic;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
