import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from "../models/loan";
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private readonly apiUrl = 'http://localhost:8080/api/loans';

  constructor(private readonly http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUserLoans(page: number = 0, size: number = 10): Observable<Page<Loan>> {
    const headers = this.getAuthHeaders();
    const registration = localStorage.getItem('registration');
    return this.http.get<Page<Loan>>(`${this.apiUrl}/user/${registration}`, { headers, params: { page, size } });
  }

  getAllLoans(page: number = 0, size: number = 10): Observable<Page<Loan>> {
    const headers = this.getAuthHeaders();
    return this.http.get<Page<Loan>>(`${this.apiUrl}`, { headers, params: { page, size } });
  }

  requestLoan(bookId: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.post<void>(`${this.apiUrl}/request/${bookId}`, {}, { headers });
  }

  approveLoan(loanId: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.post<void>(`${this.apiUrl}/${loanId}/approve`, {}, { headers });
  }

  finishLoan(loanId: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.post<void>(`${this.apiUrl}/${loanId}/finish`, {}, { headers });
  }

  renewLoan(loanId: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.post<void>(`${this.apiUrl}/${loanId}/renew`, {}, { headers });
  }
}
