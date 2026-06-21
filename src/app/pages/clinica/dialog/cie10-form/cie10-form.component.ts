import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Cie10Service } from '../../../../core/services/clinica/cie10.service';

@Component({
    selector: 'app-cie10-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './cie10-form.component.html',
    styleUrl: './cie10-form.component.scss'
})
export class Cie10FormComponent {

    form: FormGroup;
    guardando = signal(false);

    constructor(
        private fb: FormBuilder,
        private cie10Service: Cie10Service,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<Cie10FormComponent>
    ) {
        this.form = this.fb.group({
            codigo:      ['', [
                Validators.required,
                Validators.maxLength(10),
                Validators.pattern(/^[A-Z][0-9]{2}(\.[0-9]{1,4})?$/)
            ]],
            descripcion: ['', [Validators.required, Validators.maxLength(255)]],
            categoria:   ['', Validators.maxLength(100)]
        });
    }

    cerrar(): void {
        this.dialogRef.close(false);
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.guardando.set(true);
        const v = this.form.value;

        this.cie10Service.crear({
            codigo:      v.codigo.toUpperCase().trim(),
            descripcion: v.descripcion.trim(),
            categoria:   v.categoria?.trim() || null
        }).subscribe({
            next: () => {
                this.mostrarExito('Código CIE-10 personalizado creado exitosamente.');
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.mostrarError(err.error?.errores?.[0] ?? 'Error al crear código.');
                this.guardando.set(false);
            }
        });
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}