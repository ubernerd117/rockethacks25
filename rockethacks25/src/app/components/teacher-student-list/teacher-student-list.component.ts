import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { User, UserListResponse } from '../../services/backend-user.service';
import { AuthService, CurrentUser } from '../../services/auth.service';

@Component({
  selector: 'app-teacher-student-list',
  templateUrl: './teacher-student-list.component.html',
  styleUrls: ['./teacher-student-list.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TeacherStudentListComponent implements OnInit {
  students: User[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private teacherDashboardService: TeacherDashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStudents('67d63f45e698461fbcd29405');
  }

  // loadStudents() {
  //   this.isLoading = true;
  //   this.error = null;
  //   const currentUser: CurrentUser | null = this.authService.getCurrentUser();
  //   if (currentUser && currentUser._id) {
  //     console.log(currentUser._id);
  //     this.teacherDashboardService
  //       .getStudentsByTeacher(currentUser._id)
  //       .subscribe({
  //         next: (response) => {
  //           this.students = response.data;
  //           this.isLoading = false;
  //         },
  //         error: (err) => {
  //           this.error = 'Failed to load students.';
  //           console.error('Error loading students:', err);
  //           this.isLoading = false;
  //         },
  //       });
  //   } else {
  //     this.error = 'Could not determine current user.';
  //     this.isLoading = false;
  //   }
  // }

  loadStudents(userId: string) {
    this.isLoading = true;
    this.error = null;
    this.teacherDashboardService.getStudentsByTeacher(userId).subscribe({
      next: (response) => {
        this.students = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load students.';
        console.error('Error loading students:', err);
        this.isLoading = false;
      },
    });
  }
}
