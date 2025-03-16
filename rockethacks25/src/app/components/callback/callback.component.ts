import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-callback',
  template: `
    <div *ngIf="isLoading">Loading...</div>
    <div *ngIf="!isLoading && isAuthenticated">Authenticated!</div>
    <div *ngIf="!isLoading && !isAuthenticated">Error</div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class CallbackComponent implements OnInit {
  isLoading: boolean = true;
  isAuthenticated: boolean = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      this.isLoading = false;
      if (isAuthenticated) {
        this.router.navigate(['/student']);
      }
    });
  }
}
