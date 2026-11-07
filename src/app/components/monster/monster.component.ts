import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MonsterAvatarComponent } from '../../shared/monster-avatar.component';

interface ShopItem { id: string; tipo: string; valor: string; nombre: string; precio: number; }

@Component({
  selector: 'app-monster',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, MonsterAvatarComponent],
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.scss']
})
export class MonsterComponent implements OnInit {
  catalog: ShopItem[] = [];
  owned: string[] = [];
  monedas = 0;
  sel: Record<string, string> = { ojos: 'normal', boca: 'sonrisa', color: 'azul', accesorio: 'ninguno' };
  pending: ShopItem | null = null;
  message = '';
  isError = false;

  sections = [
    { tipo: 'color', titulo: '🎨 Color' },
    { tipo: 'ojos', titulo: '👀 Ojos' },
    { tipo: 'boca', titulo: '👄 Boca' },
    { tipo: 'accesorio', titulo: '🎩 Accesorios' }
  ];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.api.getMonster().subscribe(s => this.apply(s));
  }

  private apply(s: any) {
    this.catalog = s.catalog; this.owned = s.owned; this.monedas = s.monedas; this.sel = { ...s.monster };
  }

  /** Vista previa: incluye el objeto que el niño está pensando comprar. */
  get preview(): Record<string, string> {
    return this.pending ? { ...this.sel, [this.pending.tipo]: this.pending.valor } : this.sel;
  }

  itemsOf(tipo: string) { return this.catalog.filter(i => i.tipo === tipo); }
  isOwned(i: ShopItem) { return i.precio === 0 || this.owned.includes(i.id); }
  isSelected(i: ShopItem) { return this.sel[i.tipo] === i.valor; }

  choose(i: ShopItem) {
    this.message = '';
    if (this.isOwned(i)) {
      this.pending = null;
      this.sel = { ...this.sel, [i.tipo]: i.valor };
      this.api.saveMonster({ [i.tipo]: i.valor }).subscribe({
        next: s => { this.apply(s); this.say('¡Tu monstruo quedó genial! ✨'); },
        error: e => this.say(e.error?.detail || 'No se pudo guardar', true)
      });
    } else {
      this.pending = i; // primero pide confirmación (predecible y sin compras por error)
    }
  }

  confirmBuy() {
    const item = this.pending;
    if (!item) { return; }
    this.api.buyMonsterItem(item.id).subscribe({
      next: s => {
        this.apply(s); this.pending = null;
        this.auth.loadUser().subscribe();
        this.choose(item); // lo equipa de una vez
        this.say(`¡Compraste ${item.nombre}! 🎉`);
      },
      error: e => { this.pending = null; this.say(e.error?.detail || 'No se pudo comprar', true); }
    });
  }

  cancelBuy() { this.pending = null; }

  private say(text: string, error = false) { this.message = text; this.isError = error; }
}
