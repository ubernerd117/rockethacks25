import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = environment.apiBaseUrl + '/api/submissions';

  constructor(private http: HttpClient) { }

  // Get all submissions
  getAllSubmissions(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Create a new submission
  createSubmission(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // Get all submissions for an assignment
  getSubmissionsByAssignment(assignmentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/assignment/${assignmentId}`);
  }

  // Get all submissions by a student
  getSubmissionsByStudent(studentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${studentId}`);
  }

  // Get all submissions for a class
  getSubmissionsByClass(classId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/class/${classId}`);
  }

  // Get a single submission
  getSubmission(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Update a submission
  updateSubmission(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  // Manually grade a submission
  gradeSubmission(id: string, gradeData: { gradeReceived: number, feedback: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/grade`, gradeData);
  }

  // Auto-grade a submission with AI
  autoGradeSubmission(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/auto-grade`, {});
  }

  // Delete a submission
  deleteSubmission(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 