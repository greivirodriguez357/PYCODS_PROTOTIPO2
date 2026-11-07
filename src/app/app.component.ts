import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './services/auth.service';
import { avatarIcon } from './shared/avatars';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, ButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Pycods';
  readonly avatarIcon = avatarIcon;

  constructor(public auth: AuthService) {}

  calm = localStorage.getItem('calm') === '1';

  toggleCalm() {
    this.calm = !this.calm;
    localStorage.setItem('calm', this.calm ? '1' : '0');
    document.body.classList.toggle('calm', this.calm);
  }

  ngOnInit(): void {
    document.body.classList.toggle('calm', this.calm);
    // Si hay token guardado, recupera al usuario para mostrarlo en la barra
    this.auth.ensureUser().subscribe();
  }

  logout() {
    this.auth.logout();
  }
}
