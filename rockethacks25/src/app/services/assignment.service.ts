import { Injectable } from '@angular/core';

export interface Assignment {
  filename: string;
  studentUsername: string;
  classId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private assignments: Assignment[] = [];

  constructor() {}

  addAssignment(
    filename: string,
    studentUsername: string,
    classId: string
  ): void {
    this.assignments.push({ filename, studentUsername, classId });
  }

  getAssignmentsForClass(classId: string): Assignment[] {
    return this.assignments.filter((a) => a.classId === classId);
  }

  getAssignmentsForTeacher(classIds: string[]): Assignment[] {
    return this.assignments.filter((a) => classIds.includes(a.classId));
  }
}
