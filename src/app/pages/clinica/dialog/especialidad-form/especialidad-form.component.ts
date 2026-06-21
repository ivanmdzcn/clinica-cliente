import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EspecialidadService } from '../../../../core/services/clinica/especialidad.service';
import { Especialidad } from '../../../../core/models/clinica/especialidad.model';

@Component({
    selector: 'app-especialidad-form',
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
    templateUrl: './especialidad-form.component.html',
    styleUrl: './especialidad-form.component.scss'
})
export class EspecialidadFormComponent implements OnInit {

    form!: FormGroup;
    cargando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private especialidadService: EspecialidadService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<EspecialidadFormComponent>,
        @Inject(MAT_DIALOG_DATA) public especialidad: Especialidad | null
    ) {
        this.modoEdicion = !!this.especialidad;
    }

    ngOnInit(): void {
        this.inicializarForm();
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            nombre:      [this.especialidad?.nombre ?? '', [Validators.required, Validators.maxLength(100)]],
            descripcion: [this.especialidad?.descripcion ?? '', Validators.maxLength(500)]
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

        this.cargando.set(true);

        if (this.modoEdicion) {
            const dto = {
                nombre:      this.form.value.nombre,
                descripcion: this.form.value.descripcion || null,
                activo:      true
            };

            this.especialidadService.actualizar(this.especialidad!.idEspecialidad, dto).subscribe({
                next: () => {
                    this.mostrarExito('Especialidad actualizada exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.errores?.[0] ?? 'Error al actualizar.');
                    this.cargando.set(false);
                }
            });
        } else {
            const dto = {
                nombre:      this.form.value.nombre,
                descripcion: this.form.value.descripcion || null
            };

            this.especialidadService.crear(dto).subscribe({
                next: () => {
                    this.mostrarExito('Especialidad creada exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.errores?.[0] ?? 'Error al crear.');
                    this.cargando.set(false);
                }
            });
        }
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }

    get nombre() { return this.form.get('nombre')!; }
}