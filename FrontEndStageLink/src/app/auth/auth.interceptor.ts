import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  console.log('[AUTH INTERCEPTOR] URL:', req.url);
  console.log('[AUTH INTERCEPTOR] Token présent:', !!token);
  console.log('[AUTH INTERCEPTOR] Type de contenu:', req.headers.get('Content-Type'));
  console.log('[AUTH INTERCEPTOR] Est FormData:', req.body instanceof FormData);
  
  if (token) {
    // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
    // avec la bonne boundary
    const headers: any = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    };

    // Si ce n'est pas une requête FormData, on peut définir le Content-Type
    if (!(req.body instanceof FormData)) {
      if (!req.headers.has('Content-Type')) {
        headers['Content-Type'] = 'application/json';
      }
    }
    
    const authReq = req.clone({
      setHeaders: headers
    });
    
    console.log('[AUTH INTERCEPTOR] Headers ajoutés:', authReq.headers);
    return next(authReq);
  }
  
  return next(req);
};
