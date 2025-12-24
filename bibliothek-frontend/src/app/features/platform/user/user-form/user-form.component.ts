import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent {
  userForm: FormGroup;

  message = '';
  messageSuccess = false;
  messageError = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.userForm = this.fb.group({
      registration: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['ROLE_USER', Validators.required],
    });
  }

  registerUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.showMessage('COMMON.FORM_INVALID_ERROR', true);
      return;
    }

    this.message = '';
    const registerRequest = this.userForm.value;

    this.authService
      .registerUser(registerRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.clearForm();
          this.showMessage('NEW_USER.MESSAGES.SUCCESS', false);
        },
        error: (err) => {
          console.error(err);
          this.showMessage('NEW_USER.MESSAGES.ERROR', true);
        },
      });
  }

  clearForm(): void {
    this.userForm.reset({
      registration: '',
      name: '',
      password: '',
      roles: 'ROLE_USER',
    });
    this.message = '';
  }

  private showMessage(key: string, isError: boolean): void {
    this.message = key;
    this.messageSuccess = !isError;
    this.messageError = isError;
    setTimeout(() => (this.message = ''), 5000);
  }
}
