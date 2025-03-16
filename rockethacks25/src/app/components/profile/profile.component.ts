import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  template: `
    <div *ngIf="auth.user$ | async as user">
      <h2>Profile</h2>
      <p>Name: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
      <button (click)="getAccessToken()">Get Access Token</button>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class ProfileComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getAccessTokenSilently().subscribe((token) => {
      console.log(token);
    });
  }

  getAccessToken() {
    this.auth.getAccessTokenSilently().subscribe((token) => {
      console.log(token);
    });
  }
}
