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

import { ModuloService } from '../../../../core/services/seguridad/modulo.service';
import { Modulo } from '../../../../core/models/seguridad/modulo.model';

@Component({
    selector: 'app-modulo-form',
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
    templateUrl: './modulo-form.component.html',
    styleUrl: './modulo-form.component.scss'
})
export class ModuloFormComponent implements OnInit {

    form!: FormGroup;
    cargando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private moduloService: ModuloService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<ModuloFormComponent>,
        @Inject(MAT_DIALOG_DATA) public modulo: Modulo | null
    ) {
        this.modoEdicion = !!this.modulo;
    }

    ngOnInit(): void {
        this.inicializarForm();
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            nombre: [this.modulo?.nombre ?? '', [Validators.required, Validators.maxLength(80)]]
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
                activo: true
            };

            this.moduloService.actualizar(this.modulo!.idModulo, dto).subscribe({
                next: () => {
                    this.mostrarExito('Módulo actualizado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al actualizar módulo.');
                    this.cargando.set(false);
                }
            });
        } else {
            this.moduloService.crear(this.form.value).subscribe({
                next: () => {
                    this.mostrarExito('Módulo creado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al crear módulo.');
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