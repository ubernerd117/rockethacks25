import { Injectable } from '@angular/core';

interface User {
  username: string;
  role: 'student' | 'teacher';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor() {}

  login(username: string, password?: string): boolean {
    if (username === 'student1' || username === 'student2') {
      this.currentUser = { username, role: 'student' };
      return true;
    } else if (username === 'teacher1') {
      this.currentUser = { username, role: 'teacher' };
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
