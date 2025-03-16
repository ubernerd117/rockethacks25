import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes),
//   ],
// };

import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  SecurityContext,
} from '@angular/core';
import { routes } from './app.routes';
import { environment } from './environments/environment';
import { AuthModule } from '@auth0/auth0-angular';
import { MarkdownModule } from 'ngx-markdown';
import 'prismjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      AuthModule.forRoot({
        domain: environment.auth0Domain,
        clientId: environment.auth0ClientId,
        authorizationParams: {
          redirect_uri: window.location.origin + '/callback',
          audience: environment.auth0Audience,
        },
      }),
      MarkdownModule.forRoot({
        sanitize: SecurityContext.NONE
      })
    ),
    provideHttpClient(),
  ],
};
