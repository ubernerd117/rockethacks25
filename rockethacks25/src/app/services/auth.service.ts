import { Injectable } from '@angular/core';
import { UserService, User } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private userService: UserService) {}

  login(username: string, password?: string): boolean {
    const user = this.userService
      .getUsers()
      .find((u) => u.username === username && u.password === password);

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
