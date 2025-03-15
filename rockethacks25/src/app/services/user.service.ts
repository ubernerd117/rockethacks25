import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password?: string;
  role: 'student' | 'teacher';
  classId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    {
      username: 'student1',
      password: 'password123',
      role: 'student',
      classId: 'math101',
    },
    {
      username: 'student2',
      password: 'password456',
      role: 'student',
      classId: 'science101',
    },
    { username: 'teacher1', password: 'teacherpass', role: 'teacher' },
    { username: 'teacher2', password: 'testpass', role: 'teacher' },
  ];

  constructor() {}

  getUsers(): User[] {
    return this.users;
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  addUser(newUser: User): void {
    this.users.push(newUser);
  }

  updateUser(updatedUser: User): void {
    const index = this.users.findIndex(
      (u) => u.username === updatedUser.username
    );
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }
}
