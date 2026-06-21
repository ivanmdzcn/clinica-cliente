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

import { CitaService } from '../../../../core/services/clinica/cita.service';
import { Cita, ESTADOS_CITA, CambiarEstadoCita } from '../../../../core/models/clinica/cita.model';

export interface EstadoCitaFormData {
    cita: Cita;
}

@Component({
    selector: 'app-estado-cita-form',
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
    templateUrl: './estado-cita-form.component.html',
    styleUrl: './estado-cita-form.component.scss'
})
export class EstadoCitaFormComponent {

    form: FormGroup;
    estadosCita = ESTADOS_CITA;
    cargando = signal(false);

    constructor(
        private fb: FormBuilder,
        private citaService: CitaService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<EstadoCitaFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EstadoCitaFormData
    ) {
        this.form = this.fb.group({
            estado:            [this.data.cita.estado, Validators.required],
            motivoCancelacion: ['']
        });
    }

    get requiereMotivo(): boolean {
        return this.form.get('estado')?.value === 'cancelada';
    }

    formatearHora(hora: string): string {
        return hora?.substring(0, 5) ?? '';
    }

    cerrar(): void {
        this.dialogRef.close(false);
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const estado = this.form.value.estado;

        if (this.requiereMotivo && !this.form.value.motivoCancelacion) {
            this.mostrarError('El motivo de cancelación es obligatorio.');
            return;
        }

        this.cargando.set(true);
        const dto: CambiarEstadoCita = {
            estado:            estado,
            motivoCancelacion: this.form.value.motivoCancelacion || null
        };

        this.citaService.cambiarEstado(this.data.cita.idCita, dto).subscribe({
            next: () => {
                this.mostrarExito('Estado actualizado exitosamente.');
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.mostrarError(err.error?.errores?.[0] ?? 'Error al cambiar estado.');
                this.cargando.set(false);
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