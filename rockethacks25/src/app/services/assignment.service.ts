import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Assignment {
  _id: string;
  name: string;
  description?: string;
  dueDate: Date;
  totalPoints: number;
  classId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private apiUrl = environment.apiBaseUrl + '/api/assignments';

  constructor(private http: HttpClient) {}

  // Get all assignments
  getAssignments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get assignments for a specific class
  getAssignmentsByClass(classId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?classId=${classId}`);
  }

  // Get a single assignment
  getAssignment(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create a new assignment
  createAssignment(assignmentData: any): Observable<any> {
    return this.http.post(this.apiUrl, assignmentData);
  }

  // Update an assignment
  updateAssignment(id: string, assignmentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, assignmentData);
  }

  // Delete an assignment
  deleteAssignment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
