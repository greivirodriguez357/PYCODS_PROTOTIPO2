import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Añade el JWT a cada petición /api y cierra sesión si el servidor responde 401. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const token = localStorage.getItem('token');

  const authReq = token && req.url.startsWith('/api')
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const isLoginCall = req.url.includes('/auth/login');
      if (err.status === 401 && !isLoginCall && token) {
        injector.get(AuthService).logout();
      }
      return throwError(() => err);
    })
  );
};
