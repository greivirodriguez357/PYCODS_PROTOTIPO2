import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Ruta relativa: el navegador llama a http://localhost:4042/api/...
  // En Docker, Nginx lo reenvía a backend:8001; con `ng serve`, proxy.conf.json
  // lo reenvía a localhost:8001. Así no hay peticiones cross-origin (sin CORS).
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // Auth
  register(userData: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/register`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<{ access_token: string; token_type: string }> {
    return this.http.post<{ access_token: string; token_type: string }>(`${this.baseUrl}/auth/login`, credentials);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`);
  }

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/`);
  }

  updateMe(data: { avatar?: string }): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/me`, data);
  }

  // Exercises
  getExercises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/exercises/`);
  }

  getCompletedExercises(userId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/exercises/progress/${userId}`);
  }

  submitProgress(userId: number, progressData: { ejercicio_id: number; completado: boolean }): Observable<any> {
    return this.http.post(`${this.baseUrl}/exercises/progress/${userId}`, progressData);
  }

  // Monstruo y juegos
  getMonster(): Observable<any> { return this.http.get(`${this.baseUrl}/gamification/monster`); }
  buyMonsterItem(itemId: string): Observable<any> { return this.http.post(`${this.baseUrl}/gamification/monster/buy`, { item_id: itemId }); }
  saveMonster(parts: Record<string, string>): Observable<any> { return this.http.put(`${this.baseUrl}/gamification/monster`, parts); }
  completeMemory(movimientos: number): Observable<any> { return this.http.post(`${this.baseUrl}/gamification/memory`, { movimientos }); }

  // Gamification
  getGamificationStatus(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/gamification/status/${userId}`);
  }
}
