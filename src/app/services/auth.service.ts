import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  /** Usuario con sesión iniciada (null si no hay). */
  readonly user$ = this.userSubject.asObservable();

  constructor(private api: ApiService, private router: Router) {}

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.api.login(credentials).pipe(
      tap(res => localStorage.setItem(TOKEN_KEY, res.access_token)),
      switchMap(() => this.loadUser())
    );
  }

  /** Registra y, si sale bien, inicia sesión automáticamente. */
  register(data: { nombre: string; email: string; password: string; rol: string }): Observable<User> {
    return this.api.register(data).pipe(
      switchMap(() => this.login({ email: data.email, password: data.password }))
    );
  }

  /** Pide al servidor los datos frescos del usuario actual. */
  loadUser(): Observable<User> {
    return this.api.getMe().pipe(tap(user => this.userSubject.next(user)));
  }

  /** Devuelve el usuario en caché o lo carga si hay token. */
  ensureUser(): Observable<User | null> {
    if (this.userSubject.value) { return of(this.userSubject.value); }
    if (!this.token) { return of(null); }
    return this.loadUser().pipe(catchError(() => { this.clearSession(); return of(null); }));
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.userSubject.next(null);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }
}
