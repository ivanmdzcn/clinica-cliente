import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConsultaService } from '../../../../core/services/clinica/consulta.service';
import { MedicoService } from '../../../../core/services/clinica/medico.service';
import { Consulta, CrearConsulta, ActualizarConsulta, TIPOS_CONSULTA, ESTADOS_CONSULTA }
    from '../../../../core/models/clinica/consulta.model';
import { Medico } from '../../../../core/models/clinica/medico.model';

export interface ConsultaFormData {
    idPaciente: number;
    consulta: Consulta | null;
}

@Component({
    selector: 'app-consulta-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './consulta-form.component.html',
    styleUrl: './consulta-form.component.scss'
})
export class ConsultaFormComponent implements OnInit {

    form!: FormGroup;
    medicos = signal<Medico[]>([]);
    tiposConsulta    = TIPOS_CONSULTA;
    estadosConsulta  = ESTADOS_CONSULTA;
    minFechaConsulta = new Date(new Date().setDate(new Date().getDate() + 1));

    cargando = signal(false);
    modoEdicion = false;

    constructor(
        private fb: FormBuilder,
        private consultaService: ConsultaService,
        private medicoService: MedicoService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<ConsultaFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConsultaFormData
    ) {
        this.modoEdicion = !!this.data.consulta;
    }

    ngOnInit(): void {
        this.cargarMedicos();
        this.inicializarForm();
    }

    cargarMedicos(): void {
        this.medicoService.obtenerActivos().subscribe({
            next: (data) => this.medicos.set(data)
        });
    }

    inicializarForm(): void {
        const c = this.data.consulta;
        this.form = this.fb.group({
            idMedico:             [c?.idMedico ?? null, Validators.required],
            tipoConsulta:         [c?.tipoConsulta ?? null],
            motivoConsulta:       [c?.motivoConsulta ?? '', [Validators.required, Validators.maxLength(2000)]],
            evolucionTratamiento: [c?.evolucionTratamiento ?? ''],
            observaciones:        [c?.observaciones ?? ''],
            proximaCita:          [c?.proximaCita ? new Date(c.proximaCita) : null],
            estado:               [c?.estado ?? 'abierta']
        });
    }

    formatearFechaConsulta(fecha: Date | null): string | null {
        if (!fecha) return null;
        const d = new Date(fecha);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

        if (this.modoEdicion) {
            const dto: ActualizarConsulta = {
                tipoConsulta:         v.tipoConsulta  || null,
                motivoConsulta:       v.motivoConsulta,
                evolucionTratamiento: v.evolucionTratamiento || null,
                observaciones:        v.observaciones || null,
                proximaCita:          this.formatearFechaConsulta(v.proximaCita),
                estado:               v.estado
            };

            this.consultaService.actualizar(this.data.consulta!.idConsulta, dto).subscribe({
                next: () => {
                    this.mostrarExito('Consulta actualizada exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.errores?.[0] ?? 'Error al actualizar consulta.');
                    this.cargando.set(false);
                }
            });
        } else {
            const dto: CrearConsulta = {
                idPaciente:           this.data.idPaciente,
                idMedico:             v.idMedico,
                idCita:               null,
                tipoConsulta:         v.tipoConsulta  || null,
                motivoConsulta:       v.motivoConsulta,
                evolucionTratamiento: v.evolucionTratamiento || null,
                observaciones:        v.observaciones || null,
                proximaCita:          this.formatearFechaConsulta(v.proximaCita)
            };

            this.consultaService.crear(dto).subscribe({
                next: () => {
                    this.mostrarExito('Consulta registrada exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.errores?.[0] ?? 'Error al registrar consulta.');
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
}