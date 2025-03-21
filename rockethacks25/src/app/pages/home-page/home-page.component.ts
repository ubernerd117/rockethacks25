import { Component } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component';
import { RouterModule } from '@angular/router';
import { Auth0Component } from '../../components/auth0/auth0.component';
import { SignupComponent } from '../../components/auth0-signup/auth0-signup.component';
import { LogoutButtonComponent } from '../../components/logout-button/logout-button.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    LoginComponent,
    RouterModule,
    Auth0Component,
    SignupComponent,
    LogoutButtonComponent,
    CommonModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  constructor(public authService: AuthService) {}
}
