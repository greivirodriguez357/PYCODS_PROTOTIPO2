import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { MonsterComponent } from './components/monster/monster.component';
import { MemoryComponent } from './components/memory/memory.component';
import { authGuard, staffGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'exercise/:id', component: ExerciseComponent, canActivate: [authGuard] },
  { path: 'juegos/memoria', component: MemoryComponent, canActivate: [authGuard] },
  { path: 'monstruo', component: MonsterComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [staffGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
