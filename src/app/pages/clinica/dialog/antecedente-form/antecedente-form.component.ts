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

import { AntecedenteService } from '../../../../core/services/clinica/antecedente.service';
import { Antecedente, TIPOS_ANTECEDENTE } from '../../../../core/models/clinica/antecedente.model';

export interface AntecedenteFormData {
    idPaciente: number;
    antecedente: Antecedente | null;
}

@Component({
    selector: 'app-antecedente-form',
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
    templateUrl: './antecedente-form.component.html',
    styleUrl: './antecedente-form.component.scss'
})
export class AntecedenteFormComponent {

    form: FormGroup;
    tiposAntecedente = TIPOS_ANTECEDENTE;
    cargando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private antecedenteService: AntecedenteService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<AntecedenteFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AntecedenteFormData
    ) {
        this.modoEdicion = !!this.data.antecedente;
        this.form = this.fb.group({
            tipo:        [this.data.antecedente?.tipo ?? 'personal', Validators.required],
            condicion:   [this.data.antecedente?.condicion ?? '', [Validators.required, Validators.maxLength(150)]],
            descripcion: [this.data.antecedente?.descripcion ?? '', Validators.maxLength(2000)]
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
            tipo:        v.tipo,
            condicion:   v.condicion,
            descripcion: v.descripcion || null
        };

        if (this.modoEdicion) {
            this.antecedenteService.actualizar(this.data.idPaciente, this.data.antecedente!.idAntecedente, dto).subscribe({
                next: () => {
                    this.mostrarExito('Antecedente actualizado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al actualizar antecedente.');
                    this.cargando.set(false);
                }
            });
        } else {
            this.antecedenteService.crear(this.data.idPaciente, dto).subscribe({
                next: () => {
                    this.mostrarExito('Antecedente registrado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al registrar antecedente.');
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

    get condicion() { return this.form.get('condicion')!; }
}