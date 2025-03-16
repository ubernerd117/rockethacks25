import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Replace with your actual API base URL when you have one
  private apiUrl = 'https://api.example.com'; 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Generic method to get data from API
  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`, this.getHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Generic method to post data to API
  post<T>(path: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, data, this.getHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Generic method to update data
  put<T>(path: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, data, this.getHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Generic method to delete data
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`, this.getHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Helper method to get headers including auth token
  private getHeaders() {
    // You can add Auth0 token here when needed
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  // Error handling
  private handleError(error: any) {
    console.error('API error:', error);
    return throwError(() => error);
  }

  // Example methods for your app's features
  getAssignments(): Observable<any> {
    return this.get('/assignments');
  }

  getAssignment(id: string): Observable<any> {
    return this.get(`/assignments/${id}`);
  }

  createAssignment(data: any): Observable<any> {
    return this.post('/assignments', data);
  }

  updateAssignment(id: string, data: any): Observable<any> {
    return this.put(`/assignments/${id}`, data);
  }

  deleteAssignment(id: string): Observable<any> {
    return this.delete(`/assignments/${id}`);
  }
} 