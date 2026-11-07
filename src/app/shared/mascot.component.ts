import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MascotMood = 'happy' | 'cheer' | 'think';

/** Pyco, el monstruito amigo de Pycods. Reacciona según el estado de ánimo. */
@Component({
  selector: 'app-mascot',
  standalone: true,
  imports: [CommonModule],
  template: `
  <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 120 120" role="img" aria-label="Pyco, tu amigo monstruo" class="mascot">
    <ellipse cx="60" cy="113" rx="28" ry="5" fill="rgba(0,0,0,.12)"/>
    <line x1="42" y1="24" x2="36" y2="9" stroke="#6366f1" stroke-width="4" stroke-linecap="round"/>
    <circle cx="35" cy="8" r="5.5" fill="#fbbf24"/>
    <line x1="78" y1="24" x2="84" y2="9" stroke="#6366f1" stroke-width="4" stroke-linecap="round"/>
    <circle cx="85" cy="8" r="5.5" fill="#f472b6"/>
    <path *ngIf="mood !== 'cheer'" d="M22 80 Q9 88 13 99" stroke="#818cf8" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path *ngIf="mood !== 'cheer'" d="M98 80 Q111 88 107 99" stroke="#818cf8" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path *ngIf="mood === 'cheer'" class="wave" d="M22 68 Q6 52 11 36" stroke="#818cf8" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path *ngIf="mood === 'cheer'" class="wave" d="M98 68 Q114 52 109 36" stroke="#818cf8" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path d="M20 72 C20 37 40 21 60 21 C80 21 100 37 100 72 C100 97 85 110 60 110 C35 110 20 97 20 72Z" fill="#818cf8"/>
    <ellipse cx="60" cy="86" rx="26" ry="19" fill="#c7d2fe"/>
    <circle cx="45" cy="58" r="12" fill="#fff"/><circle cx="75" cy="58" r="12" fill="#fff"/>
    <circle [attr.cx]="mood==='think' ? 48 : 46" [attr.cy]="mood==='think' ? 54 : 60" r="5.5" fill="#1e1b4b"/>
    <circle [attr.cx]="mood==='think' ? 78 : 76" [attr.cy]="mood==='think' ? 54 : 60" r="5.5" fill="#1e1b4b"/>
    <circle cx="31" cy="73" r="6" fill="#f9a8d4" opacity=".7"/><circle cx="89" cy="73" r="6" fill="#f9a8d4" opacity=".7"/>
    <path *ngIf="mood === 'happy'" d="M48 77 Q60 89 72 77" stroke="#1e1b4b" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path *ngIf="mood === 'cheer'" d="M45 75 Q60 100 75 75 Z" fill="#7c2d12"/>
    <circle *ngIf="mood === 'think'" cx="60" cy="82" r="5" fill="#1e1b4b"/>
  </svg>`,
  styles: [`
    :host { display: inline-block; line-height: 0; }
    .mascot { animation: bob 3.2s ease-in-out infinite; overflow: visible; }
    .wave { transform-origin: 60px 70px; animation: wiggle 1s ease-in-out infinite alternate; }
    @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    @keyframes wiggle { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }
    :host-context(body.calm) .mascot, :host-context(body.calm) .wave { animation: none; }
    @media (prefers-reduced-motion: reduce) { .mascot, .wave { animation: none; } }
  `]
})
export class MascotComponent {
  @Input() mood: MascotMood = 'happy';
  @Input() size = 120;
}
