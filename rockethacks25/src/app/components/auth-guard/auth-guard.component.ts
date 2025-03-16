// import { Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   Router,
//   RouterStateSnapshot,
//   UrlTree,
// } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from '../../services/auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ):
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree {
//     if (this.authService.isLoggedIn()) {
//       const expectedRole = route.data['role'];
//       if (expectedRole) {
//         if (
//           (expectedRole === 'student' && this.authService.isStudent()) ||
//           (expectedRole === 'teacher' && this.authService.isTeacher())
//         ) {
//           return true;
//         } else {
//           this.router.navigate(['/']);
//           return false;
//         }
//       }
//       return true;
//     } else {
//       this.router.navigate(['/']);
//       return false;
//     }
//   }
// }

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      tap((loggedIn) => {
        if (!loggedIn) {
          // When the user is not authenticated, redirect to the login page and save the url.
          this.auth.loginWithRedirect({ appState: { target: state.url } });
        }
      })
    );
  }
}
