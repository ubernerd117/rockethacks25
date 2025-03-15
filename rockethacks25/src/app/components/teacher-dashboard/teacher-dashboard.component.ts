import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FileViewerComponent } from '../file-viewer/file-viewer.component';
import { CommonModule } from '@angular/common';
import { ClassManagementComponent } from '../class-management/class-management.component';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
  standalone: true,
  imports: [FileViewerComponent, CommonModule, ClassManagementComponent],
})
export class TeacherDashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
