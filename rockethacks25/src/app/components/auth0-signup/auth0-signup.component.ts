// import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-signup',
//   template: ` <button (click)="signup()">Sign Up</button> `,
//   standalone: true,
// })
// export class SignupComponent {
//   constructor(public auth: AuthService) {}
//   role: string = 'student';

//   signup() {
//     this.auth.loginWithRedirect({
//       authorizationParams: {
//         screen_hint: 'signup',
//         audience: 'https://rocketgrades.com',
//       },
//       appState: { role: this.role },
//     });
//   }
// }

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './auth0-signup.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SignupComponent {
  role: string = 'student';
  constructor(public auth: AuthService) {}

  signup() {
    console.log('signup function', this.role);
    this.auth.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
        audience: 'https://rocketgrades.com',
      },
      // appState: JSON.stringify({ role: this.role }),
      appState: JSON.stringify({ role: this.role }),
    });
  }
}
