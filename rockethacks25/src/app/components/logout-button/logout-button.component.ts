import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout-button',
  template: ` <button (click)="logout()">Log Out</button> `,
  standalone: true,
})
export class LogoutButtonComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
