import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

const PALETTE: Record<string, [string, string]> = {
  azul: ['#818cf8', '#c7d2fe'], verde: ['#34d399', '#a7f3d0'],
  rosa: ['#f472b6', '#fbcfe8'], naranja: ['#fb923c', '#fed7aa']
};

/** Monstruo personalizable: ojos, boca, color y accesorio. */
@Component({
  selector: 'app-monster-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
  <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 120 120" role="img" [attr.aria-label]="'Tu monstruo ' + color" class="monster">
    <ellipse cx="60" cy="113" rx="28" ry="5" fill="rgba(0,0,0,.12)"/>
    <path d="M20 72 C20 37 40 21 60 21 C80 21 100 37 100 72 C100 97 85 110 60 110 C35 110 20 97 20 72Z" [attr.fill]="main"/>
    <ellipse cx="60" cy="87" rx="26" ry="18" [attr.fill]="light"/>
    <path d="M22 80 Q9 88 13 99" [attr.stroke]="main" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path d="M98 80 Q111 88 107 99" [attr.stroke]="main" stroke-width="9" stroke-linecap="round" fill="none"/>

    <ng-container [ngSwitch]="ojos">
      <ng-container *ngSwitchCase="'estrellas'">
        <text x="45" y="67" text-anchor="middle" font-size="26">⭐</text><text x="75" y="67" text-anchor="middle" font-size="26">⭐</text>
      </ng-container>
      <ng-container *ngSwitchCase="'grandes'">
        <circle cx="45" cy="58" r="15" fill="#fff"/><circle cx="75" cy="58" r="15" fill="#fff"/>
        <circle cx="46" cy="60" r="7.5" fill="#1e1b4b"/><circle cx="76" cy="60" r="7.5" fill="#1e1b4b"/>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <circle cx="45" cy="58" r="12" fill="#fff"/><circle cx="75" cy="58" r="12" fill="#fff"/>
        <circle cx="46" cy="60" r="5.5" fill="#1e1b4b"/><circle cx="76" cy="60" r="5.5" fill="#1e1b4b"/>
      </ng-container>
    </ng-container>

    <circle cx="30" cy="75" r="6" fill="#f9a8d4" opacity=".7"/><circle cx="90" cy="75" r="6" fill="#f9a8d4" opacity=".7"/>

    <ng-container [ngSwitch]="boca">
      <ng-container *ngSwitchCase="'risa'"><path d="M42 78 Q60 104 78 78 Z" fill="#7c2d12"/><path d="M50 90 Q60 84 70 90 Q60 98 50 90Z" fill="#fb7185"/></ng-container>
      <ellipse *ngSwitchCase="'sorpresa'" cx="60" cy="86" rx="7" ry="9" fill="#7c2d12"/>
      <path *ngSwitchDefault d="M47 80 Q60 93 73 80" stroke="#1e1b4b" stroke-width="4" stroke-linecap="round" fill="none"/>
    </ng-container>

    <ng-container [ngSwitch]="accesorio">
      <ng-container *ngSwitchCase="'gorra'"><path d="M28 36 Q60 4 92 36 Z" fill="#ef4444"/><rect x="24" y="33" width="72" height="7" rx="3.5" fill="#b91c1c"/></ng-container>
      <ng-container *ngSwitchCase="'lentes'"><circle cx="45" cy="58" r="15" fill="rgba(255,255,255,.25)" stroke="#1e293b" stroke-width="3.5"/><circle cx="75" cy="58" r="15" fill="rgba(255,255,255,.25)" stroke="#1e293b" stroke-width="3.5"/><line x1="60" y1="58" x2="60" y2="58" stroke="#1e293b" stroke-width="3.5"/></ng-container>
      <polygon *ngSwitchCase="'corona'" points="32,32 40,8 52,24 60,4 68,24 80,8 88,32" fill="#fbbf24" stroke="#f59e0b" stroke-width="3" stroke-linejoin="round"/>
    </ng-container>
  </svg>`,
  styles: [`:host { display: inline-block; line-height: 0; } .monster { overflow: visible; }`]
})
export class MonsterAvatarComponent {
  @Input() ojos = 'normal';
  @Input() boca = 'sonrisa';
  @Input() color = 'azul';
  @Input() accesorio = 'ninguno';
  @Input() size = 180;
  get main() { return (PALETTE[this.color] ?? PALETTE['azul'])[0]; }
  get light() { return (PALETTE[this.color] ?? PALETTE['azul'])[1]; }
}
