import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    AuthService
  ]
};
