import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { ApiService } from '../../services/api.service';
import { MascotComponent } from '../../shared/mascot.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextareaModule, MessageModule, MascotComponent],
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent implements OnInit {
  exerciseId = 1;
  codeSolution = '';
  consoleOutput = '';
  feedbackMessage = '';
  isSuccess = false;
  expectedOutput = '';

  exerciseData = {
    titulo: 'Cargando ejercicio...',
    teoria: '',
    instruccion: 'Escribe tu código y usa print() para mostrar el resultado.',
    xp: 0
  };

  constructor(private route: ActivatedRoute, private api: ApiService, private auth: AuthService) {
    this.exerciseId = Number(this.route.snapshot.paramMap.get('id')) || 1;
  }

  ngOnInit(): void {
    this.api.getExercises().subscribe(list => {
      const ex = list.find(e => e.id === this.exerciseId);
      if (!ex) { this.exerciseData.titulo = 'Ejercicio no encontrado'; return; }
      this.exerciseData = {
        titulo: `Ejercicio ${ex.titulo}`,
        teoria: ex.descripcion,
        instruccion: 'Completa o modifica el código de ejemplo y ejecútalo con el botón. Usa print() para mostrar tu resultado.',
        xp: ex.xp_recompensa
      };
      this.codeSolution = ex.ejemplo_codigo ?? '';
      this.expectedOutput = ex.respuesta_correcta ?? '';
    });
  }

  // Simulación: aún no se ejecuta Python real, solo se valida que el código use print()
  runCode() {
    const user = this.auth.currentUser;
    if (this.codeSolution.includes('print(') && user) {
      this.consoleOutput = this.expectedOutput || '¡Código ejecutado!';
      this.isSuccess = true;
      this.api.submitProgress(user.id, { ejercicio_id: this.exerciseId, completado: true }).subscribe({
        next: (res) => {
          this.feedbackMessage = res.xp_ganado > 0
            ? `¡Excelente trabajo! 🎉 Has ganado +${res.xp_ganado} XP y 5 Monedas.`
            : '¡Muy bien! 🎉 Ya habías completado este reto, ¡sigue repasando!';
          this.auth.loadUser().subscribe(); // refresca XP y nivel
        },
        error: () => { this.feedbackMessage = '¡Código correcto! Pero no se pudo guardar tu progreso.'; }
      });
    } else {
      this.consoleOutput = 'Error de sintaxis o falta usar print().';
      this.isSuccess = false;
      this.feedbackMessage = 'Revisa tu código e inténtalo de nuevo. Recuerda usar print().';
    }
  }

  playAudioGuide() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(`${this.exerciseData.teoria}. ${this.exerciseData.instruccion}`);
      msg.lang = 'es-ES';
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    }
  }
}
