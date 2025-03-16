import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Amplify } from 'aws-amplify';

// Configure Amplify
Amplify.configure({
  // Empty configuration since we're using Auth0 for authentication
  // and not using Amplify's API Gateway or other services
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
