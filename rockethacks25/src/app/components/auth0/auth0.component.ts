import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth0',
  template: ` <button (click)="login()">Log In</button> `,
  standalone: true,
})
export class Auth0Component {
  constructor(public auth: AuthService) {}

  login() {
    this.auth.loginWithRedirect();
  }
}
