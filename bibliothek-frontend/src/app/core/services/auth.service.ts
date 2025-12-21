import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserInfo } from '../models/user-info';
import { TokenData } from '../models/token-data';
import { LoginResponse } from '../models/login-response';
import { RegisterRequest } from '../models/register-request';
import { RegisterResponse } from '../models/register-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly userApiUrl = 'http://localhost:8080/api/user';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const tokenData: TokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(tokenData.exp * 1000);
    return expirationDate > new Date();
  }

  login(registration: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      registration,
      password,
    });
  }

  registerUser(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, registerRequest, {
      headers,
    });
  }

  getUserInfo(registration: string): Observable<UserInfo> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserInfo>(`${this.userApiUrl}/${registration}`, {
      headers,
    });
  }

  updateProfilePicture(base64Image: string): Observable<void> {
    const registration = localStorage.getItem('registration');
    const headers = this.getAuthHeaders();

    return this.http
      .patch<void>(
        `${this.userApiUrl}/${registration}`,
        { profilePic: base64Image },
        { headers }
      )
      .pipe(tap(() => localStorage.setItem('profilePic', base64Image)));
  }

  updatePassword(newPassword: string): Observable<void> {
    const registration = localStorage.getItem('registration');
    const headers = this.getAuthHeaders();

    return this.http.patch<void>(
      `${this.userApiUrl}/${registration}`,
      { password: newPassword },
      { headers }
    );
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const tokenData: TokenData = JSON.parse(atob(token.split('.')[1]));
    return (
      tokenData.role.includes('ROLE_ADMIN') || tokenData.role.includes('ADMIN')
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
