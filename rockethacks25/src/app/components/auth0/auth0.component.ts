import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth0',
  template: `
    <button (click)="login()" class="btn btn-primary">Log In</button>
  `,
  standalone: true,
})
export class Auth0Component {
  constructor(public auth: AuthService) {}

  // login() {
  //   this.auth.loginWithRedirect();
  // }

  login() {
    // Use Auth0's loginWithRedirect instead of custom logic
    this.auth.loginWithRedirect({
      authorizationParams: {
        audience: 'https://rocketgrades.com',
      },
    });
  }
}
