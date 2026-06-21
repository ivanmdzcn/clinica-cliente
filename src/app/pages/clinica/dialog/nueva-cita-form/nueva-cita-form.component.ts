import { Component, Inject, OnInit, Optional, signal } from '@angular/core';
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

import { CitaService } from '../../../../core/services/clinica/cita.service';
import { MedicoService } from '../../../../core/services/clinica/medico.service';
import { HorarioMedicoService } from '../../../../core/services/clinica/horario-medico.service';
import { PacienteService } from '../../../../core/services/clinica/paciente.service';
import { CrearCita, SlotDisponible } from '../../../../core/models/clinica/cita.model';
import { Medico } from '../../../../core/models/clinica/medico.model';
import { Paciente } from '../../../../core/models/clinica/paciente.model';

export interface NuevaCitaFormData {
    idPacientePreseleccionado?: number | null;
}

@Component({
    selector: 'app-nueva-cita-form',
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
    templateUrl: './nueva-cita-form.component.html',
    styleUrl: './nueva-cita-form.component.scss'
})
export class NuevaCitaFormComponent implements OnInit {

    form!: FormGroup;
    medicos       = signal<Medico[]>([]);
    pacientes     = signal<Paciente[]>([]);
    slots         = signal<SlotDisponible[]>([]);
    minFecha      = new Date();

    cargando      = signal(false);
    cargandoSlots = signal(false);

    constructor(
        private fb:                   FormBuilder,
        private citaService:          CitaService,
        private medicoService:        MedicoService,
        private horarioMedicoService: HorarioMedicoService,
        private pacienteService:      PacienteService,
        private snackBar:             MatSnackBar,
        private dialogRef:            MatDialogRef<NuevaCitaFormComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: NuevaCitaFormData | null
    ) {}

    ngOnInit(): void {
        this.inicializarForm();
        this.cargarMedicos();
        this.cargarPacientes();
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            idPaciente:    [this.data?.idPacientePreseleccionado ?? null, Validators.required],
            idMedico:      [null, Validators.required],
            fechaCita:     [null, Validators.required],
            horaCita:      [null, Validators.required],
            observaciones: ['']
        });
    }

    cargarMedicos(): void {
        this.medicoService.obtenerActivos().subscribe({
            next: (data) => this.medicos.set(data)
        });
    }

    cargarPacientes(): void {
        this.pacienteService.obtenerTodos().subscribe({
            next: (data) => this.pacientes.set(data.filter(p => p.activo))
        });
    }

    onMedicoFechaChange(): void {
        const idMedico = this.form.get('idMedico')?.value;
        const fecha    = this.form.get('fechaCita')?.value;

        if (!idMedico || !fecha) return;

        const d = new Date(fecha);
        const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

        this.cargandoSlots.set(true);
        this.form.patchValue({ horaCita: null });

        this.horarioMedicoService.obtenerSlots(idMedico, fechaStr).subscribe({
            next: (data) => {
                this.slots.set(data);
                this.cargandoSlots.set(false);
            },
            error: () => {
                this.slots.set([]);
                this.cargandoSlots.set(false);
            }
        });
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
        const d = new Date(v.fechaCita);
        const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

        const dto: CrearCita = {
            idPaciente:    v.idPaciente,
            idMedico:      v.idMedico,
            fechaCita:     fechaStr,
            horaCita:      v.horaCita,
            observaciones: v.observaciones || null
        };

        this.citaService.crear(dto).subscribe({
            next: () => {
                this.mostrarExito('Cita registrada exitosamente.');
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.mostrarError(err.error?.errores?.[0] ?? 'Error al registrar cita.');
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

    get idPaciente() { return this.form.get('idPaciente')!; }
    get idMedico()   { return this.form.get('idMedico')!;   }
    get fechaCita()  { return this.form.get('fechaCita')!;  }
    get horaCita()   { return this.form.get('horaCita')!;   }
}