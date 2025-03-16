import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

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
export class LoginComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private authService: AuthService, 
    private auth0Service: Auth0Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.auth0Service.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      
      if (isAuth) {
        // Check user role and redirect to appropriate dashboard
        this.auth0Service.user$.subscribe(user => {
          if (this.authService.isTeacher()) {
            this.router.navigate(['/teacher']);
          } else if (this.authService.isStudent()) {
            this.router.navigate(['/student']);
          }
        });
      }
    });
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}
