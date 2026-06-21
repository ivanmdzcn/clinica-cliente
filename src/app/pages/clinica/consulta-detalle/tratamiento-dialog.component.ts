import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TratamientoService } from '../../../core/services/clinica/tratamiento.service';
import {
    Tratamiento, CrearTratamiento, ActualizarTratamiento,
    TIPOS_TRATAMIENTO, ESTADOS_TRATAMIENTO
} from '../../../core/models/clinica/tratamiento.model';

export interface TratamientoDialogData {
    idConsulta:   number;
    tratamiento?: Tratamiento;
}

@Component({
    selector: 'app-tratamiento-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
        MatSnackBarModule
    ],
    templateUrl: './tratamiento-dialog.component.html',
    styleUrl:    './tratamiento-dialog.component.scss'
})
export class TratamientoDialogComponent implements OnInit {

    form!:        FormGroup;
    guardando   = false;
    modoEdicion = false;
    tiposTratamiento   = TIPOS_TRATAMIENTO;
    estadosTratamiento = ESTADOS_TRATAMIENTO;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: TratamientoDialogData,
        private dialogRef:          MatDialogRef<TratamientoDialogComponent>,
        private fb:                 FormBuilder,
        private tratamientoService: TratamientoService,
        private snackBar:           MatSnackBar
    ) {}

    ngOnInit(): void {
        this.modoEdicion = !!this.data.tratamiento;
        const t = this.data.tratamiento;

        this.form = this.fb.group({
            tipo:             [t?.tipo         ?? 'farmacologico', Validators.required],
            descripcion:      [t?.descripcion  ?? '', [Validators.required]],
            indicaciones:     [t?.indicaciones ?? ''],
            fechaInicio:      [t?.fechaInicio  ? new Date(t.fechaInicio) : null],
            fechaFin:         [t?.fechaFin     ? new Date(t.fechaFin)    : null],
            estado:           [t?.estado       ?? 'activo', Validators.required],
            motivoSuspension: [t?.motivoSuspension ?? '']
        });

        // Validación condicional motivo suspensión
        this.form.get('estado')!.valueChanges.subscribe(estado => {
            const ctrl = this.form.get('motivoSuspension')!;
            if (estado === 'suspendido') {
                ctrl.setValidators([Validators.required, Validators.maxLength(500)]);
            } else {
                ctrl.clearValidators();
            }
            ctrl.updateValueAndValidity();
        });
    }

    get requiereMotivo(): boolean {
        return this.form.get('estado')?.value === 'suspendido';
    }

    formatearFecha(fecha: Date | null): string | null {
        if (!fecha) return null;
        const d = new Date(fecha);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.guardando = true;
        const v = this.form.value;

        if (this.modoEdicion) {
            const dto: ActualizarTratamiento = {
                tipo:             v.tipo,
                descripcion:      v.descripcion,
                indicaciones:     v.indicaciones     || null,
                fechaInicio:      this.formatearFecha(v.fechaInicio),
                fechaFin:         this.formatearFecha(v.fechaFin),
                estado:           v.estado,
                motivoSuspension: v.motivoSuspension || null
            };

            this.tratamientoService
                .actualizar(this.data.idConsulta, this.data.tratamiento!.idTratamiento, dto)
                .subscribe({
                    next: () => {
                        this.guardando = false;
                        this.snackBar.open('Tratamiento actualizado.', 'Cerrar',
                            { duration: 3000, panelClass: ['snack-success'] });
                        this.dialogRef.close(true);
                    },
                    error: (err) => {
                        this.guardando = false;
                        this.snackBar.open(
                            err.error?.errores?.[0] ?? 'Error al actualizar.',
                            'Cerrar', { duration: 4000, panelClass: ['snack-error'] }
                        );
                    }
                });
        } else {
            const dto: CrearTratamiento = {
                idConsulta:   this.data.idConsulta,
                tipo:         v.tipo,
                descripcion:  v.descripcion,
                indicaciones: v.indicaciones || null,
                fechaInicio:  this.formatearFecha(v.fechaInicio),
                fechaFin:     this.formatearFecha(v.fechaFin)
            };

            this.tratamientoService.crear(this.data.idConsulta, dto).subscribe({
                next: () => {
                    this.guardando = false;
                    this.snackBar.open('Tratamiento registrado.', 'Cerrar',
                        { duration: 3000, panelClass: ['snack-success'] });
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.guardando = false;
                    this.snackBar.open(
                        err.error?.errores?.[0] ?? 'Error al registrar.',
                        'Cerrar', { duration: 4000, panelClass: ['snack-error'] }
                    );
                }
            });
        }
    }
}