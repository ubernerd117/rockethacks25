import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  template: ` <button (click)="signup()">Sign Up</button> `,
  standalone: true,
})
export class SignupComponent {
  constructor(public auth: AuthService) {}

  signup() {
    this.auth.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  }
}
