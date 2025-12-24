import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  currentLang: string;

  errorMessage: string = '';
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {
    this.loginForm = this.formBuilder.group({
      registration: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    const savedLang = localStorage.getItem('lang') || 'en';
    this.currentLang = savedLang;
    this.translate.use(savedLang);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { registration, password } = this.loginForm.value;

    this.authService
      .login(registration, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('registration', registration);
          this.getUserInfo(registration);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'LOGIN.ERROR_INVALID';
          this.isLoading = false;
        },
      });
  }

  switchLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  private getUserInfo(registration: string): void {
    this.authService
      .getUserInfo(registration)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userInfo) => {
          localStorage.setItem('name', userInfo.name);
          localStorage.setItem('profilePic', userInfo.profilePic);
          this.router.navigate(['/platform']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'LOGIN.ERROR_UNEXPECTED';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
