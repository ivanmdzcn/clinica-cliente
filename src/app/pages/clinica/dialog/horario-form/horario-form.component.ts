import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HorarioMedicoService } from '../../../../core/services/clinica/horario-medico.service';
import { HorarioMedico, DIAS_SEMANA } from '../../../../core/models/clinica/horario-medico.model';

export interface HorarioFormData {
    idMedico: number;
    horario: HorarioMedico | null;
}

@Component({
    selector: 'app-horario-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './horario-form.component.html',
    styleUrl: './horario-form.component.scss'
})
export class HorarioFormComponent implements OnInit {

    form!: FormGroup;
    diasSemana = DIAS_SEMANA;
    cargando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private horarioService: HorarioMedicoService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<HorarioFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: HorarioFormData
    ) {
        this.modoEdicion = !!this.data.horario;
    }

    ngOnInit(): void {
        this.inicializarForm();
    }

    inicializarForm(): void {
        const h = this.data.horario;
        this.form = this.fb.group({
            diaSemana:       [h?.diaSemana ?? null, Validators.required],
            horaInicio:      [h?.horaInicio ?? '', Validators.required],
            horaFin:         [h?.horaFin ?? '', Validators.required],
            duracionSlotMin: [h?.duracionSlotMin ?? 30, [Validators.required, Validators.min(5), Validators.max(120)]],
            activo:          [h?.activo ?? true]
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

        const horaInicio = this.form.value.horaInicio;
        const horaFin    = this.form.value.horaFin;
        if (horaInicio >= horaFin) {
            this.mostrarError('La hora de fin debe ser mayor a la hora de inicio.');
            return;
        }

        this.cargando.set(true);
        const v = this.form.value;

        if (this.modoEdicion) {
            const dto = {
                diaSemana:       v.diaSemana,
                horaInicio:      v.horaInicio,
                horaFin:         v.horaFin,
                duracionSlotMin: v.duracionSlotMin,
                activo:          v.activo
            };
            this.horarioService.actualizar(this.data.idMedico, this.data.horario!.idHorario, dto).subscribe({
                next: () => {
                    this.mostrarExito('Horario actualizado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.errores?.[0] ?? 'Error al actualizar horario.');
                    this.cargando.set(false);
                }
            });
        } else {
            const dto = {
                idMedico:        this.data.idMedico,
                diaSemana:       v.diaSemana,
                horaInicio:      v.horaInicio,
                horaFin:         v.horaFin,
                duracionSlotMin: v.duracionSlotMin
            };
            this.horarioService.crear(this.data.idMedico, dto).subscribe({
                next: () => {
                    this.mostrarExito('Horario creado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.errores?.[0] ?? 'Error al crear horario.');
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

    get diaSemana()       { return this.form.get('diaSemana')!;       }
    get horaInicio()      { return this.form.get('horaInicio')!;       }
    get horaFin()         { return this.form.get('horaFin')!;          }
    get duracionSlotMin() { return this.form.get('duracionSlotMin')!;  }
}