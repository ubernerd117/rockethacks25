import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Class {
  _id: string;
  name: string;
  description?: string;
  code: string;
  teacher: string;
  students: string[];
  assignments: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private apiUrl = environment.apiBaseUrl + '/api/classes';

  constructor(private http: HttpClient) {}

  // Get all classes
  getClasses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get a single class
  getClass(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Get classes for a teacher
  getClassesForTeacher(teacherId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?teacher=${teacherId}`);
  }

  // Create a new class
  createClass(classData: any): Observable<any> {
    return this.http.post(this.apiUrl, classData);
  }

  // Update a class
  updateClass(id: string, classData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, classData);
  }

  // Delete a class
  deleteClass(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Add student to class
  addStudentToClass(classId: string, studentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${classId}/students`, { studentId });
  }

  // Remove student from class
  removeStudentFromClass(classId: string, studentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${classId}/students/${studentId}`);
  }
}
