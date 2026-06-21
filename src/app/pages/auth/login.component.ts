import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    form: FormGroup;
    cargando = signal(false);
    mostrarContrasena = signal(false);

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        // Si ya está autenticado redirigir al dashboard
        if (this.authService.estaAutenticado())
            this.router.navigate(['/dashboard']);

        this.form = this.fb.group({
            email:      ['', [Validators.required, Validators.email]],
            contrasena: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    toggleContrasena(): void {
        this.mostrarContrasena.update(v => !v);
    }

    login(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.cargando.set(true);

        this.authService.login(this.form.value).subscribe({
            next: () => {
                // Dejamos el loader visible un momento antes de navegar
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                }, 800);
            },
            error: (err) => {
                this.cargando.set(false);
                const mensaje = err.error?.mensaje ?? 'Error al iniciar sesión.';
                this.snackBar.open(mensaje, 'Cerrar', {
                    duration: 4000,
                    panelClass: ['snack-error']
                });
            }
        });
    }

    // Helpers para el template
    get email()      { return this.form.get('email')!; }
    get contrasena() { return this.form.get('contrasena')!; }
}