import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoanService } from 'src/app/core/services/loan.service';
import { Loan } from 'src/app/core/models/loan';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userForm = {
    password: '',
    profilePic: localStorage.getItem('profilePic') || '',
  };

  currentPage = 0;
  totalPages = 1;
  loading = true;
  loans: Loan[] = [];

  registration: string | null = localStorage.getItem('registration');

  showInfo = true;
  showPhotoForm = false;
  showPasswordForm = false;

  message = '';
  messageSuccess = false;
  messageError = false;

  constructor(
    private readonly authService: AuthService,
    private readonly loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.loadUserLoans();
  }

  loadUserLoans(): void {
    this.loading = true;
    if (this.registration) {
      this.loanService.getUserLoans().subscribe({
        next: (response) => {
          this.loans = response.content;
          this.totalPages = response.page.totalPages;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }

  getCurrentUserName(): string {
    return localStorage.getItem('name') || 'User';
  }

  getProfilePic(): string {
    const storedPic = localStorage.getItem('profilePic');
    if (storedPic && storedPic !== 'null' && storedPic.trim() !== '') {
      return storedPic;
    }
    return 'assets/profile-picture.png';
  }

  togglePhotoForm(): void {
    this.resetMessage();
    this.showInfo = false;
    this.showPhotoForm = true;
    this.showPasswordForm = false;
  }

  togglePasswordForm(): void {
    this.resetMessage();
    this.showInfo = false;
    this.showPhotoForm = false;
    this.showPasswordForm = true;
  }

  cancelEdit(): void {
    this.showInfo = true;
    this.showPhotoForm = false;
    this.showPasswordForm = false;
  }

  resetMessage(): void {
    this.message = '';
    this.messageSuccess = false;
    this.messageError = false;
  }

  updateProfilePic(): void {
    const newPic = this.userForm.profilePic;
    const FIVE_MB = 7000000;

    if (!newPic) {
      this.showMessage('USER_PROFILE.MESSAGES.SELECT_IMAGE_ERROR', true);
      return;
    }

    if (newPic.length > FIVE_MB) {
      this.showMessage('USER_PROFILE.MESSAGES.IMAGE_SIZE_ERROR', true);
      return;
    }

    this.authService.updateProfilePicture(newPic).subscribe({
      next: () => {
        this.showMessage('USER_PROFILE.MESSAGES.PHOTO_SUCCESS', false);
        localStorage.setItem('profilePic', newPic);
        setTimeout(() => this.cancelEdit(), 1000);
      },
      error: (err) => {
        console.error(err);
        this.showMessage('USER_PROFILE.MESSAGES.PHOTO_ERROR', true);
      },
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.userForm.profilePic = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updatePassword(): void {
    if (!this.userForm.password) {
      this.showMessage('USER_PROFILE.MESSAGES.PASSWORD_EMPTY_ERROR', true);
      return;
    }

    this.authService.updatePassword(this.userForm.password).subscribe({
      next: () => {
        this.showMessage('USER_PROFILE.MESSAGES.PASSWORD_SUCCESS', false);
        this.userForm.password = '';
        setTimeout(() => this.cancelEdit(), 1000);
      },
      error: () =>
        this.showMessage('USER_PROFILE.MESSAGES.PASSWORD_ERROR', true),
    });
  }

  private showMessage(key: string, isError: boolean): void {
    this.message = key;
    this.messageError = isError;
    this.messageSuccess = !isError;
    setTimeout(() => (this.message = ''), 5000);
  }
}
