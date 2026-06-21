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

import { RolService } from '../../../../core/services/seguridad/rol.service';
import { Rol } from '../../../../core/models/seguridad/rol.model';

@Component({
    selector: 'app-rol-form',
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
    templateUrl: './rol-form.component.html',
    styleUrl: './rol-form.component.scss'
})
export class RolFormComponent implements OnInit {

    form!: FormGroup;
    cargando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private rolService: RolService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<RolFormComponent>,
        @Inject(MAT_DIALOG_DATA) public rol: Rol | null
    ) {
        this.modoEdicion = !!this.rol;
    }

    ngOnInit(): void {
        this.inicializarForm();
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            nombre:      [this.rol?.nombre ?? '', [Validators.required, Validators.maxLength(80)]],
            descripcion: [this.rol?.descripcion ?? '', Validators.maxLength(255)]
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
                nombre: this.form.value.nombre,
                descripcion: this.form.value.descripcion,
                activo: true
            };

            this.rolService.actualizar(this.rol!.idRol, dto).subscribe({
                next: () => {
                    this.mostrarExito('Rol actualizado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al actualizar rol.');
                    this.cargando.set(false);
                }
            });
        } else {
            const dto = {
                nombre: this.form.value.nombre,
                descripcion: this.form.value.descripcion,
                creadoPor: null
            };

            this.rolService.crear(dto).subscribe({
                next: () => {
                    this.mostrarExito('Rol creado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al crear rol.');
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

    get nombre()      { return this.form.get('nombre')!; }
    get descripcion() { return this.form.get('descripcion')!; }
}