import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/** Solo usuarios con sesión iniciada. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.ensureUser().pipe(
    map(user => user ? true : router.createUrlTree(['/login']))
  );
};

/** Solo docentes y administradores. */
export const staffGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.ensureUser().pipe(
    map(user => {
      if (!user) { return router.createUrlTree(['/login']); }
      return user.rol === 'admin' || user.rol === 'docente' ? true : router.createUrlTree(['/dashboard']);
    })
  );
};
