import { Injectable } from '@angular/core';
import { AuthClientConfig, AuthService as Auth0Service } from '@auth0/auth0-angular';
import { UserService, User } from './user.service';
import { Observable, of, map, catchError, from, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private auth0: Auth0Service
  ) {
    // Subscribe to authentication state changes
    this.auth0.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.auth0.user$.subscribe(auth0User => {
          if (auth0User) {
            // Map Auth0 user to your User model
            // You might need to adapt this based on your User model
            this.currentUser = {
              id: auth0User.sub || '',
              username: auth0User.email || '',
              name: auth0User.name || '',
              // Default role or fetch from Auth0 user metadata
              role: (auth0User['https://rockethacks25.com/roles'] as string) || 'student',
              email: auth0User.email || '',
              // Add other properties as needed
            } as User;
          }
        });
      } else {
        this.currentUser = null;
      }
    });
  }

  login(): void {
    this.auth0.loginWithRedirect();
  }

  logout(): void {
    this.auth0.logout({ 
      logoutParams: {
        returnTo: window.location.origin 
      }
    });
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.auth0.isAuthenticated$ ? true : false;
  }

  isTeacher(): boolean {
    return this.currentUser?.role === 'teacher';
  }

  isStudent(): boolean {
    return this.currentUser?.role === 'student';
  }
}
