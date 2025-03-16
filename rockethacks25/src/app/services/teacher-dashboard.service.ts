import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserListResponse } from './backend-user.service'; // Import User and UserListResponse

@Injectable({
  providedIn: 'root',
})
export class TeacherDashboardService {
  private apiUrl = 'http://localhost:3800/api/users'; // Adjust if your backend is on a different port

  constructor(private http: HttpClient) {}

  getStudentsByTeacher(teacherId: string): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(
      `${this.apiUrl}/teachers/${teacherId}/students`
    );
  }
}
