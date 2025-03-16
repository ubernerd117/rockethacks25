import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { CommonModule } from '@angular/common';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  standalone: true,
  imports: [FileUploadComponent, CommonModule, LogoutButtonComponent],
})
export class StudentDashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
