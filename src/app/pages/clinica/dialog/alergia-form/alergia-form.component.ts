import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AlergiaService } from '../../../../core/services/clinica/alergia.service';
import { Alergia, SEVERIDADES } from '../../../../core/models/clinica/alergia.model';

export interface AlergiaFormData {
    idPaciente: number;
    alergia: Alergia | null;
}

@Component({
    selector: 'app-alergia-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './alergia-form.component.html',
    styleUrl: './alergia-form.component.scss'
})
export class AlergiaFormComponent {

    form: FormGroup;
    severidades = SEVERIDADES;
    cargando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private alergiaService: AlergiaService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<AlergiaFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AlergiaFormData
    ) {
        this.modoEdicion = !!this.data.alergia;
        this.form = this.fb.group({
            medicamentoOElemento: [this.data.alergia?.medicamentoOElemento ?? '', [Validators.required, Validators.maxLength(100)]],
            severidad:            [this.data.alergia?.severidad ?? 'leve', Validators.required],
            reaccion:              [this.data.alergia?.reaccion ?? '', Validators.maxLength(1000)]
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
        const v = this.form.value;
        const dto = {
            medicamentoOElemento: v.medicamentoOElemento,
            severidad:            v.severidad,
            reaccion:             v.reaccion || null
        };

        if (this.modoEdicion) {
            this.alergiaService.actualizar(this.data.idPaciente, this.data.alergia!.idAlergia, dto).subscribe({
                next: () => {
                    this.mostrarExito('Alergia actualizada exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al actualizar alergia.');
                    this.cargando.set(false);
                }
            });
        } else {
            this.alergiaService.crear(this.data.idPaciente, dto).subscribe({
                next: () => {
                    this.mostrarExito('Alergia registrada exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al registrar alergia.');
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

    get medicamentoOElemento() { return this.form.get('medicamentoOElemento')!; }
}