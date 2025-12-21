import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly apiUrl = 'http://localhost:8080/api/book';

  constructor(private readonly http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  filterBooks(searchQuery: string, page: number, size: number): Observable<Page<Book>> {
    const headers = this.getAuthHeaders();
    
    const params: { page: string; size: string; searchQuery?: string } = {
      page: page.toString(),
      size: size.toString()
    };

    if (searchQuery?.trim()) {
      params.searchQuery = searchQuery.trim();
    }

    return this.http.get<Page<Book>>(`${this.apiUrl}`, { headers, params });
  }

  getFeaturedBooks(): Observable<Book[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Book[]>(`${this.apiUrl}/featured`, { headers });
  }

  getById(id: string): Observable<Book> {
    const headers = this.getAuthHeaders();
    return this.http.get<Book>(`${this.apiUrl}/${id}`, { headers });
  }

  create(book: Book): Observable<Book> {
    const headers = this.getAuthHeaders();
    return this.http.post<Book>(`${this.apiUrl}`, book, { headers });
  }

  update(book: Book): Observable<Book> {
    const headers = this.getAuthHeaders();
    return this.http.put<Book>(`${this.apiUrl}/${book.id}`, book, { headers });
  }

  delete(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getRecommendationsByGenre(genre: string): Observable<Book[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Book[]>(`${this.apiUrl}/recommendations`, {
      headers,
      params: { genre },
    });
  }
}
