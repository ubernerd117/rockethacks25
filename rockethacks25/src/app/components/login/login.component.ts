import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    RouterModule,
  ],
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false; // Initialize as false (hidden)

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.authService.login(this.username, this.password)) {
      if (this.authService.isTeacher()) {
        this.router.navigate(['/teacher']);
      } else if (this.authService.isStudent()) {
        this.router.navigate(['/student']);
      }
    } else {
      alert('Invalid username or password.');
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
