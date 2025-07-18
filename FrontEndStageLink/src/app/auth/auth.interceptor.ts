import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  console.log('[AUTH INTERCEPTOR] URL:', req.url);
  console.log('[AUTH INTERCEPTOR] Token présent:', !!token);
  console.log('[AUTH INTERCEPTOR] Token:', token ? token.substring(0, 20) + '...' : 'null');
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
    console.log('[AUTH INTERCEPTOR] Headers ajoutés:', authReq.headers);
    return next(authReq);
  }
  return next(req);
};
