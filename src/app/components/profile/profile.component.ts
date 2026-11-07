import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { AVATARS } from '../../shared/avatars';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectButtonModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  profileForm: FormGroup;
  avatars = AVATARS;

  learningOptions = [
    { label: '🔊 Escuchando con voz', value: 'audio' },
    { label: '🤫 Leyendo en silencio', value: 'visual' }
  ];

  selectedAvatar: string = 'avatar1';

  saving = false;

  constructor(private fb: FormBuilder, private router: Router, private api: ApiService, private auth: AuthService) {
    this.profileForm = this.fb.group({
      preferencia: ['audio']
    });
    // Muestra el avatar que ya tiene guardado el usuario
    const saved = this.auth.currentUser?.avatar;
    if (saved && AVATARS.some(a => a.id === saved)) { this.selectedAvatar = saved; }
  }

  selectAvatar(id: string) {
    this.selectedAvatar = id;
  }

  saveProfile() {
    this.saving = true;
    this.api.updateMe({ avatar: this.selectedAvatar }).subscribe({
      next: () => this.auth.loadUser().subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => this.router.navigate(['/dashboard'])
      }),
      error: () => { this.saving = false; }
    });
  }
}
