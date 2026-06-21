import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
    selector: 'app-cambiar-contrasena',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './cambiar-contrasena.component.html',
    styleUrl: './cambiar-contrasena.component.scss'
})
export class CambiarContrasenaComponent {
    form: FormGroup;
    cargando       = signal(false);
    mostrarActual  = signal(false);
    mostrarNueva   = signal(false);
    mostrarConfirm = signal(false);

    constructor(
        private fb:          FormBuilder,
        private authService: AuthService,
        private snackBar:    MatSnackBar,
        private dialogRef:   MatDialogRef<CambiarContrasenaComponent>
    ) {
        this.form = this.fb.group({
            contrasenaActual:    ['', Validators.required],
            contrasenaNueva:     ['', [Validators.required, Validators.minLength(8)]],
            confirmarContrasena: ['', Validators.required]
        }, { validators: this.contrasenasCoincidenValidator });
    }

    contrasenasCoincidenValidator(group: FormGroup) {
        const nueva     = group.get('contrasenaNueva')?.value;
        const confirmar = group.get('confirmarContrasena')?.value;
        return nueva === confirmar ? null : { noCoinciden: true };
    }

    toggleMostrarActual(): void {
        this.mostrarActual.set(!this.mostrarActual());
    }
    toggleMostrarNueva(): void {
        this.mostrarNueva.set(!this.mostrarNueva());
    }
    toggleMostrarConfirm(): void {
        this.mostrarConfirm.set(!this.mostrarConfirm());
    }

    cerrar(): void {
        this.dialogRef.close(false);
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.cargando.set(true);
        const dto = {
            contrasenaActual:    this.form.value.contrasenaActual,
            contrasenaNueva:     this.form.value.contrasenaNueva,
            confirmarContrasena: this.form.value.confirmarContrasena
        };
        this.authService.cambiarContrasena(dto).subscribe({
            next: () => {
                this.snackBar.open('Contraseña actualizada exitosamente.', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['snack-success']
                });
                this.cargando.set(false);
                this.dialogRef.close(true);
            },
            error: (err) => {
                const mensaje = err.error?.mensaje ?? 'Error al cambiar contraseña.';
                this.snackBar.open(mensaje, 'Cerrar', {
                    duration: 4000,
                    panelClass: ['snack-error']
                });
                this.cargando.set(false);
            }
        });
    }

    get contrasenaActual()    { return this.form.get('contrasenaActual')!; }
    get contrasenaNueva()     { return this.form.get('contrasenaNueva')!; }
    get confirmarContrasena() { return this.form.get('confirmarContrasena')!; }
}