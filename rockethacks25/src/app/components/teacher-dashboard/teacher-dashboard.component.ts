import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router'; // Import RouterLink
import { FileViewerComponent } from '../file-viewer/file-viewer.component';
import { CommonModule } from '@angular/common';
import { ClassManagementComponent } from '../class-management/class-management.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { TeacherStudentListComponent } from '../teacher-student-list/teacher-student-list.component';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
  standalone: true,
  imports: [FileViewerComponent, CommonModule, ClassManagementComponent, RouterLink, ChatbotComponent, TeacherStudentListComponent,], // Add RouterLink
})
export class TeacherDashboardComponent {
  teacherClasses: any[] = [1, 2, 3]; // Add this line - Initialize teacherClasses
  teacherAssignments: any[] = ['assignment1', 'assignment2']; // Add this line - Initialize teacherAssignments

  constructor(private authService: AuthService, private router: Router) {}

  viewClasses() {
    this.router.navigate(['/classes']);
  }

  viewAssignments() {
    this.router.navigate(['/assignments']);
  }

  viewStatistics() {
    this.router.navigate(['/statistics']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
