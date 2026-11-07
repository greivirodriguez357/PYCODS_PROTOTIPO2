import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { avatarIcon } from '../../shared/avatars';
import { MascotComponent } from '../../shared/mascot.component';

interface LearningModule {
  color: string; soft: string; id: number; titulo: string; desc: string; icon: string; xp: number;
  estado: 'completado' | 'disponible' | 'bloqueado';
}

const MODULE_ICONS = ['📦', '🔀', '🔄', '📜', '⭐'];
const MODULE_COLORS = [['#6366f1', '#e0e7ff'], ['#f59e0b', '#fef3c7'], ['#10b981', '#d1fae5'], ['#ec4899', '#fce7f3'], ['#06b6d4', '#cffafe']];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ProgressBarModule, ButtonModule, TagModule, MascotComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  avatar = '🤖';
  progresoGeneral = 0;
  modules: LearningModule[] = [];
  loading = true;
  nextMessage = '';

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    // Datos frescos del usuario con sesión + sus ejercicios completados
    this.auth.loadUser().pipe(
      switchMap(user => {
        this.user = user;
        this.avatar = avatarIcon(user.avatar);
        return forkJoin({
          exercises: this.api.getExercises(),
          done: this.api.getCompletedExercises(user.id)
        });
      })
    ).subscribe({
      next: ({ exercises, done }) => {
        let unlockedGiven = false;
        this.modules = exercises.map((e, i) => {
          let estado: LearningModule['estado'] = 'bloqueado';
          if (done.includes(e.id)) { estado = 'completado'; }
          else if (!unlockedGiven) { estado = 'disponible'; unlockedGiven = true; }
          const [color, soft] = MODULE_COLORS[i % MODULE_COLORS.length];
          return { color, soft, id: e.id, titulo: e.titulo, desc: e.descripcion, icon: MODULE_ICONS[i] ?? '⭐', xp: e.xp_recompensa, estado };
        });
        const completados = this.modules.filter(m => m.estado === 'completado').length;
        this.progresoGeneral = this.modules.length ? Math.round((completados / this.modules.length) * 100) : 0;
        const next = this.modules.find(m => m.estado === 'disponible');
        this.nextMessage = next ? `Hoy practicamos: ${next.titulo}` : '¡Completaste todos los retos! 🎉';
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
