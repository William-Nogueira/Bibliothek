import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
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

  startCloseTimer() {
    this.closeTimer = setTimeout(() => {
      this.isDropdownOpen = false;
    }, 500);
  }

  cancelCloseTimer() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  }

  logout() {
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
