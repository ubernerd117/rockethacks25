import { Injectable } from '@angular/core';

interface User {
  username: string;
  password?: string;
  role: 'student' | 'teacher';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  private users: User[] = [
    { username: 'student1', password: 'password123', role: 'student' },
    { username: 'student2', password: 'password456', role: 'student' },
    { username: 'teacher1', password: 'teacherpass', role: 'teacher' },
    { username: 'teacher2', password: 'testpass', role: 'teacher' },
  ];

  constructor() {}

  login(username: string, password?: string): boolean {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      this.currentUser = user;
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  isTeacher(): boolean {
    return this.currentUser?.role === 'teacher';
  }

  isStudent(): boolean {
    return this.currentUser?.role === 'student';
  }
}
