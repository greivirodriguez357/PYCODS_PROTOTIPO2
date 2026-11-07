import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MascotComponent } from '../../shared/mascot.component';

interface Card { uid: number; pair: number; kind: 'term' | 'def'; text: string; icon: string; flipped: boolean; matched: boolean; }

const PAIRS = [
  { term: 'print()', def: 'Muestra un mensaje en la pantalla', icon: '💬' },
  { term: 'variable', def: 'Una caja que guarda un dato', icon: '📦' },
  { term: 'if', def: 'Toma una decisión', icon: '🔀' },
  { term: 'for', def: 'Repite una acción varias veces', icon: '🔄' },
  { term: 'lista', def: 'Guarda muchos datos juntos', icon: '📜' },
  { term: '=', def: 'Guarda un valor en una variable', icon: '➡️' }
];

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, MascotComponent],
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss']
})
export class MemoryComponent implements OnInit, OnDestroy {
  cards: Card[] = [];
  moves = 0;
  matches = 0;
  total = PAIRS.length;
  locked = false;
  done = false;
  reward = '';
  private open: Card[] = [];
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void { this.newGame(); }
  ngOnDestroy(): void { clearTimeout(this.timer); }

  newGame() {
    clearTimeout(this.timer);
    const list: Card[] = [];
    PAIRS.forEach((p, i) => {
      list.push({ uid: i * 2, pair: i, kind: 'term', text: p.term, icon: p.icon, flipped: false, matched: false });
      list.push({ uid: i * 2 + 1, pair: i, kind: 'def', text: p.def, icon: p.icon, flipped: false, matched: false });
    });
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    this.cards = list; this.moves = 0; this.matches = 0; this.open = [];
    this.locked = false; this.done = false; this.reward = '';
  }

  flip(c: Card) {
    if (this.locked || c.flipped || c.matched) { return; }
    c.flipped = true;
    this.open.push(c);
    if (this.open.length < 2) { return; }

    this.moves++;
    const [a, b] = this.open;
    if (a.pair === b.pair) {
      a.matched = b.matched = true;
      this.open = [];
      if (++this.matches === this.total) { this.finish(); }
    } else {
      this.locked = true;
      this.timer = setTimeout(() => { a.flipped = b.flipped = false; this.open = []; this.locked = false; }, 1200);
    }
  }

  private finish() {
    this.done = true;
    this.api.completeMemory(this.moves).subscribe({
      next: r => {
        this.reward = r.monedas_ganadas > 0
          ? `¡Ganaste 🪙 ${r.monedas_ganadas} monedas y 10 XP!`
          : '¡Muy bien! Hoy ya ganaste las monedas de 3 partidas. ¡Vuelve mañana por más!';
        this.auth.loadUser().subscribe();
      },
      error: () => this.reward = '¡Lo lograste! 🎉'
    });
  }
}
