import { Injectable } from '@angular/core';
import { User } from './user.service';

export interface Class {
  classId: string;
  className: string;
  teacherUsername: string;
  studentUsernames: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private classes: Class[] = [
    {
      classId: 'math101',
      className: 'Math 101',
      teacherUsername: 'teacher1',
      studentUsernames: ['student1'],
    },
    {
      classId: 'science101',
      className: 'Science 101',
      teacherUsername: 'teacher2',
      studentUsernames: ['student2'],
    },
  ];

  constructor() {}

  getClasses(): Class[] {
    return this.classes;
  }

  getClassById(classId: string): Class | undefined {
    return this.classes.find((c) => c.classId === classId);
  }

  getClassesForTeacher(teacherUsername: string): Class[] {
    return this.classes.filter((c) => c.teacherUsername === teacherUsername);
  }

  addClass(newClass: Class): void {
    this.classes.push(newClass);
  }

  updateClass(updatedClass: Class): void {
    const index = this.classes.findIndex(
      (c) => c.classId === updatedClass.classId
    );
    if (index !== -1) {
      this.classes[index] = updatedClass;
    }
  }
}
