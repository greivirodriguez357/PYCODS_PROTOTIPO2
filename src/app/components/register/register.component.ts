import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MascotComponent } from '../../shared/mascot.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputTextModule, PasswordModule, DropdownModule, ButtonModule, MessageModule, MascotComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  loading = false;
  roles = [
    { label: 'Estudiante', value: 'estudiante' },
    { label: 'Docente / Tutor', value: 'docente' },
    { label: 'Administrador', value: 'admin' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['estudiante', Validators.required]
    });
  }

  onRegister() {
    if (this.registerForm.invalid || this.loading) { return; }
    this.loading = true;
    this.errorMessage = '';
    // Crea la cuenta e inicia sesión automáticamente
    this.auth.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/profile']),
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.status === 0
          ? 'No se pudo conectar con el servidor. Inténtalo de nuevo en un momento.'
          : (typeof err.error?.detail === 'string' ? err.error.detail : 'Revisa los datos del formulario.');
      }
    });
  }
}
