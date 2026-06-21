import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConsultaService } from '../../../core/services/clinica/consulta.service';
import { MedicoService } from '../../../core/services/clinica/medico.service';
import { PacienteService } from '../../../core/services/clinica/paciente.service';
import { CitaService } from '../../../core/services/clinica/cita.service';
import { CrearConsulta, TIPOS_CONSULTA } from '../../../core/models/clinica/consulta.model';
import { Cita } from '../../../core/models/clinica/cita.model';
import { Medico } from '../../../core/models/clinica/medico.model';
import { Paciente } from '../../../core/models/clinica/paciente.model';

@Component({
    selector: 'app-nueva-consulta-dialog',
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
    templateUrl: './nueva-consulta-dialog.component.html',
    styleUrl: './nueva-consulta-dialog.component.scss'
})
export class NuevaConsultaDialogComponent implements OnInit {

    form!: FormGroup;
    medicos       = signal<Medico[]>([]);
    pacientes     = signal<Paciente[]>([]);
    citas         = signal<Cita[]>([]);
    tiposConsulta = TIPOS_CONSULTA;
    minFecha      = new Date(new Date().setDate(new Date().getDate() + 1));

    cargando = signal(false);

    constructor(
        private fb:              FormBuilder,
        private consultaService: ConsultaService,
        private medicoService:   MedicoService,
        private pacienteService: PacienteService,
        private citaService:     CitaService,
        private snackBar:        MatSnackBar,
        private dialogRef:       MatDialogRef<NuevaConsultaDialogComponent>
    ) {}

    ngOnInit(): void {
        this.inicializarForm();
        this.cargarMedicos();
        this.cargarPacientes();
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            idPaciente:           [null, Validators.required],
            idMedico:             [null, Validators.required],
            idCita:               [null],
            tipoConsulta:         [null],
            motivoConsulta:       ['', [Validators.required, Validators.maxLength(2000)]],
            evolucionTratamiento: [''],
            observaciones:        [''],
            proximaCita:          [null]
        });
    }

    cargarMedicos(): void {
        this.medicoService.obtenerActivos().subscribe({
            next: (data) => this.medicos.set(data)
        });
    }

    cargarPacientes(): void {
        this.pacienteService.obtenerTodos().subscribe({
            next: (data) => this.pacientes.set(data.filter((p: Paciente) => p.activo))
        });
    }

    onPacienteChange(): void {
        const idPaciente = this.form.get('idPaciente')?.value;
        this.form.patchValue({ idCita: null });
        this.citas.set([]);

        if (!idPaciente) return;

        this.citaService.obtenerPorPaciente(idPaciente).subscribe({
            next: (data) => {
                const citasValidas = data.filter(
                    (c: Cita) => c.estado === 'confirmada' || c.estado === 'pendiente'
                );
                this.citas.set(citasValidas);
            },
            error: () => this.citas.set([])
        });
    }

    formatearFecha(fecha: Date | null): string | null {
        if (!fecha) return null;
        const d = new Date(fecha);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

        this.cargando.set(true);
        const v = this.form.value;

        const dto: CrearConsulta = {
            idPaciente:           v.idPaciente,
            idMedico:             v.idMedico,
            idCita:               v.idCita               || null,
            tipoConsulta:         v.tipoConsulta          || null,
            motivoConsulta:       v.motivoConsulta,
            evolucionTratamiento: v.evolucionTratamiento  || null,
            observaciones:        v.observaciones         || null,
            proximaCita:          this.formatearFecha(v.proximaCita)
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

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}