// import { Injectable } from '@angular/core';
// import { UserService, User } from './user.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private currentUser: User | null = null;

//   constructor(private userService: UserService) {}

//   login(username: string, password?: string): boolean {
//     const user = this.userService
//       .getUsers()
//       .find((u) => u.username === username && u.password === password);

//     if (user) {
//       this.currentUser = user;
//       return true;
//     } else {
//       return false;
//     }
//   }

//   logout(): void {
//     this.currentUser = null;
//   }

//   getCurrentUser(): User | null {
//     return this.currentUser;
//   }

//   isLoggedIn(): boolean {
//     return !!this.currentUser;
//   }

//   isTeacher(): boolean {
//     return this.currentUser?.role === 'teacher';
//   }

//   isStudent(): boolean {
//     return this.currentUser?.role === 'student';
//   }
// }

import { Injectable } from '@angular/core';
import { AuthService as Auth0AngularAuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { User } from './user.service';

export interface CurrentUser {
  username: string;
  password?: string;
  role: 'student' | 'teacher';
  classId?: string;
  _id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: CurrentUser | null = null;

  constructor(
    private auth0: Auth0AngularAuthService,
    private userService: UserService
  ) {}

  loginWithRedirect(options?: any): void {
    this.auth0.loginWithRedirect(options); // Pass options to Auth0
  }

  logout(options?: { logoutParams?: { returnTo?: string } }): void {
    this.auth0.logout(options);
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  get user$(): Observable<any> {
    return this.auth0.user$;
  }

  getAccessTokenSilently(): Observable<string> {
    return this.auth0.getAccessTokenSilently();
  }

  //these need to go back to original
  isAuthTeacher(): Observable<boolean> {
    return this.user$.pipe(
      map((user) => {
        if (!user) {
          return false;
        }
        const roles = user['https://rocketgrades/roles'] as string[];
        return roles && roles.includes('teacher');
      })
    );
  }

  isAuthStudent(): Observable<boolean> {
    return this.user$.pipe(
      map((user) => {
        if (!user) {
          return false;
        }
        const roles = user['https://rocketgrades/roles'] as string[];
        return roles && roles.includes('student');
      })
    );
  }

  login(username: string, password?: string): boolean {
    const user = this.userService
      .getUsers()
      .find((u) => u.username === username && u.password === password);

    if (user) {
      this.currentUser = user;
      return true;
    } else {
      return false;
    }
  }

  // getCurrentUser(): User | null {
  //   return this.currentUser;
  // }

  getCurrentUser(): Observable<CurrentUser | null> {
    return this.user$.pipe(
      map((user) => {
        if (!user) {
          return null;
        }
        return {
          username: user.name,
          role:
            user['https://rocketgrades/roles'] &&
            user['https://rocketgrades/roles'].includes('teacher')
              ? 'teacher'
              : 'student',
          _id: user.sub,
        };
      })
    );
  }

  getCurrentUserId(): Observable<string | null> {
    return this.user$.pipe(
      map((user) => {
        if (!user) {
          return null;
        }
        return user.sub;
      })
    );
  }

  isTeacher(): boolean {
    return this.currentUser?.role === 'teacher';
    return true;
  }

  isStudent(): boolean {
    return this.currentUser?.role === 'student';
  }
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
