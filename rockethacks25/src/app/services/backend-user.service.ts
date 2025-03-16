import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher';
  enrolledClasses?: string[];
  teachingClasses?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResponse {
  success: boolean;
  count: number;
  data: User[];
}

@Injectable({
  providedIn: 'root',
})
export class BackendUserService {
  private apiUrl = 'http://localhost:3800/api/users'; // Adjust if your backend is on a different port

  constructor(private http: HttpClient) {}
  getStudents(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/students`);
  }

  getInstructors(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/instructors`);
  }

  getUsers(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiUrl}`);
  }
}
