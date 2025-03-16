import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../services/user.service';
import { UserListResponse } from '../../services/backend-user.service';
import { BackendUserService } from '../../services/backend-user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  userRole: 'student' | 'instructor' | 'all' = 'all';

  constructor(private backendService: BackendUserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // loadUsers(role?: 'student' | 'instructor') {
  //   this.isLoading = true;
  //   this.error = null;
  //   this.userService.getUsers(role).subscribe({
  //     next: (response) => {
  //       this.users = response.data;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.error = 'Failed to load users.';
  //       console.error('Error loading users:', err);
  //       this.isLoading = false;
  //     },
  //   });
  // }

  loadUsers() {
    this.isLoading = true;
    this.error = null;
    let request: Observable<UserListResponse>;
    if (this.userRole === 'student') {
      request = this.backendService.getStudents();
    } else if (this.userRole === 'instructor') {
      request = this.backendService.getInstructors();
    } else {
      request = this.backendService.getUsers();
    }
    request.subscribe({
      next: (response) => {
        this.users = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users.';
        console.error('Error loading users:', err);
        this.isLoading = false;
      },
    });
  }

  showStudents() {
    this.userRole = 'student';
    this.loadUsers();
  }
  showInstructors() {
    this.userRole = 'instructor';
    this.loadUsers();
  }
  showAll() {
    this.userRole = 'all';
    this.loadUsers();
  }
}
