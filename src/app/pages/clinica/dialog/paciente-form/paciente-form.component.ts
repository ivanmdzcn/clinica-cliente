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
import { MatTabsModule } from '@angular/material/tabs';

import { PacienteService } from '../../../../core/services/clinica/paciente.service';
import { SEXOS, ESTADOS_CIVILES, TIPOS_SANGRE } from '../../../../core/models/clinica/paciente.model';

@Component({
    selector: 'app-paciente-form',
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
        MatProgressSpinnerModule,
        MatTabsModule
    ],
    templateUrl: './paciente-form.component.html',
    styleUrl: './paciente-form.component.scss'
})
export class PacienteFormComponent implements OnInit {

    form!: FormGroup;

    sexos          = SEXOS;
    estadosCiviles = ESTADOS_CIVILES;
    tiposSangre    = TIPOS_SANGRE;
    maxFecha       = new Date();

    cargandoDatos = signal(false);
    cargando      = signal(false);
    modoEdicion   = false;

    constructor(
        private fb:              FormBuilder,
        private pacienteService: PacienteService,
        private snackBar:        MatSnackBar,
        private dialogRef:       MatDialogRef<PacienteFormComponent>,
        @Inject(MAT_DIALOG_DATA) public idPaciente: number | null
    ) {
        this.modoEdicion = !!this.idPaciente;
    }

    ngOnInit(): void {
        this.inicializarForm();
        if (this.modoEdicion) {
            this.cargarPaciente();
        }
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            nombres:          ['', [Validators.required, Validators.maxLength(100)]],
            apellidos:        ['', [Validators.required, Validators.maxLength(100)]],
            dpi:              ['', Validators.maxLength(20)],
            fechaNacimiento:  [null, Validators.required],
            sexo:             ['', Validators.required],
            estadoCivil:      [null],
            ocupacion:        ['', Validators.maxLength(100)],
            tipoSangre:       [null],
            telefono:         ['', Validators.maxLength(20)],
            email:            ['', [Validators.email, Validators.maxLength(100)]],
            direccion:        [''],
            telefonoEmergencia: ['', Validators.maxLength(20)],
            nombreEmergencia:   ['', Validators.maxLength(150)]
        });
    }

    cargarPaciente(): void {
        this.cargandoDatos.set(true);
        this.pacienteService.obtenerPorId(this.idPaciente!).subscribe({
            next: (data) => {
                this.form.patchValue({
                    nombres:            data.nombres,
                    apellidos:          data.apellidos,
                    dpi:                data.dpi,
                    fechaNacimiento:    data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
                    sexo:               data.sexo,
                    estadoCivil:        data.estadoCivil,
                    ocupacion:          data.ocupacion,
                    tipoSangre:         data.tipoSangre,
                    telefono:           data.telefono,
                    email:              data.email,
                    direccion:          data.direccion,
                    telefonoEmergencia: data.telefonoEmergencia,
                    nombreEmergencia:   data.nombreEmergencia
                });
                this.cargandoDatos.set(false);
            },
            error: () => {
                this.mostrarError('Error al cargar datos del paciente.');
                this.cargandoDatos.set(false);
            }
        });
    }

    formatearFecha(fecha: Date | null): string | null {
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
            const dto = {
                dpi:                v.dpi         || null,
                nombres:            v.nombres,
                apellidos:          v.apellidos,
                fechaNacimiento:    this.formatearFecha(v.fechaNacimiento),
                sexo:               v.sexo,
                estadoCivil:        v.estadoCivil || null,
                ocupacion:          v.ocupacion   || null,
                tipoSangre:         v.tipoSangre  || null,
                telefono:           v.telefono    || null,
                email:              v.email       || null,
                direccion:          v.direccion   || null,
                telefonoEmergencia: v.telefonoEmergencia || null,
                nombreEmergencia:   v.nombreEmergencia   || null,
                activo:             true
            };

            this.pacienteService.actualizar(this.idPaciente!, dto).subscribe({
                next: () => {
                    this.mostrarExito('Paciente actualizado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al actualizar paciente.');
                    this.cargando.set(false);
                }
            });
        } else {
            const dto = {
                dpi:                v.dpi         || null,
                nombres:            v.nombres,
                apellidos:          v.apellidos,
                fechaNacimiento:    this.formatearFecha(v.fechaNacimiento),
                sexo:               v.sexo,
                estadoCivil:        v.estadoCivil || null,
                ocupacion:          v.ocupacion   || null,
                tipoSangre:         v.tipoSangre  || null,
                telefono:           v.telefono    || null,
                email:              v.email       || null,
                direccion:          v.direccion   || null,
                telefonoEmergencia: v.telefonoEmergencia || null,
                nombreEmergencia:   v.nombreEmergencia   || null
            };

            this.pacienteService.crear(dto).subscribe({
                next: () => {
                    this.mostrarExito('Paciente creado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.mensaje ?? 'Error al crear paciente.');
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

    get nombres()   { return this.form.get('nombres')!; }
    get apellidos() { return this.form.get('apellidos')!; }
    get sexo()      { return this.form.get('sexo')!; }
    get email()     { return this.form.get('email')!; }
    get fechaNacimiento() { return this.form.get('fechaNacimiento')!; }
}