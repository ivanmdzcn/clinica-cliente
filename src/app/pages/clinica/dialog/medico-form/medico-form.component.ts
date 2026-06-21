import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { MedicoService } from '../../../../core/services/clinica/medico.service';
import { EspecialidadService } from '../../../../core/services/clinica/especialidad.service';
import { UsuarioService } from '../../../../core/services/seguridad/usuario.service';
import { AsignarEspecialidad } from '../../../../core/models/clinica/medico.model';
import { Especialidad } from '../../../../core/models/clinica/especialidad.model';
import { Usuario } from '../../../../core/models/seguridad/usuario.model';

@Component({
    selector: 'app-medico-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatDividerModule
    ],
    templateUrl: './medico-form.component.html',
    styleUrl: './medico-form.component.scss'
})
export class MedicoFormComponent implements OnInit {

    form!: FormGroup;

    usuarios       = signal<Usuario[]>([]);
    especialidades = signal<Especialidad[]>([]);
    especialidadesAsignadas = signal<AsignarEspecialidad[]>([]);

    busquedaEspecialidad = '';

    cargandoDatos = signal(false);
    cargando      = signal(false);
    modoEdicion   = false;

    get especialidadesFiltradas(): Especialidad[] {
        const asignadasIds = this.especialidadesAsignadas().map(e => e.idEspecialidad);
        return this.especialidades().filter(e =>
            e.activo &&
            !asignadasIds.includes(e.idEspecialidad) &&
            e.nombre.toLowerCase().includes(this.busquedaEspecialidad.toLowerCase())
        );
    }

    constructor(
        private fb:                  FormBuilder,
        private medicoService:       MedicoService,
        private especialidadService: EspecialidadService,
        private usuarioService:      UsuarioService,
        private snackBar:            MatSnackBar,
        private dialogRef:           MatDialogRef<MedicoFormComponent>,
        @Inject(MAT_DIALOG_DATA) public idMedico: number | null
    ) {
        this.modoEdicion = !!this.idMedico;
    }

    ngOnInit(): void {
        this.inicializarForm();
        this.cargarEspecialidades();

        if (this.modoEdicion) {
            this.cargarMedico();
        } else {
            this.cargarUsuarios();
        }
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            idUsuario:           [null, Validators.required],
            cedulaProfesional:   ['', [Validators.required, Validators.maxLength(50)]],
            numeroColegiado:     ['', [Validators.required, Validators.maxLength(50)]],
            consultorio:         ['', Validators.maxLength(50)],
            telefonoConsultorio: ['', Validators.maxLength(20)],
            observaciones:       ['']
        });
    }

    cargarUsuarios(): void {
        this.usuarioService.obtenerTodos().subscribe({
            next: (data) => this.usuarios.set(data.filter(u => u.activo))
        });
    }

    cargarEspecialidades(): void {
        this.especialidadService.obtenerActivos().subscribe({
            next: (data) => this.especialidades.set(data)
        });
    }

    cargarMedico(): void {
        this.cargandoDatos.set(true);
        this.medicoService.obtenerPorId(this.idMedico!).subscribe({
            next: (data) => {
                this.form.patchValue({
                    idUsuario:           data.idUsuario,
                    cedulaProfesional:   data.cedulaProfesional,
                    numeroColegiado:     data.numeroColegiado,
                    consultorio:         data.consultorio,
                    telefonoConsultorio: data.telefonoConsultorio,
                    observaciones:       data.observaciones
                });
                this.especialidadesAsignadas.set(
                    data.especialidades.map(e => ({
                        idEspecialidad: e.idEspecialidad,
                        esPrincipal:    e.esPrincipal
                    }))
                );
                this.cargandoDatos.set(false);
            },
            error: () => {
                this.mostrarError('Error al cargar datos del médico.');
                this.cargandoDatos.set(false);
            }
        });
    }

    // ── Gestión de especialidades ─────────────────────────────────────────────

    agregarEspecialidad(especialidad: Especialidad): void {
        const actual = this.especialidadesAsignadas();
        const esPrincipal = actual.length === 0;
        this.especialidadesAsignadas.set([
            ...actual,
            { idEspecialidad: especialidad.idEspecialidad, esPrincipal }
        ]);
        this.busquedaEspecialidad = '';
    }

    quitarEspecialidad(idEspecialidad: number): void {
        let lista = this.especialidadesAsignadas().filter(e => e.idEspecialidad !== idEspecialidad);
        if (lista.length > 0 && !lista.some(e => e.esPrincipal)) {
            lista = lista.map((e, i) => ({ ...e, esPrincipal: i === 0 }));
        }
        this.especialidadesAsignadas.set(lista);
    }

    togglePrincipal(idEspecialidad: number): void {
        this.especialidadesAsignadas.set(
            this.especialidadesAsignadas().map(e => ({
                ...e,
                esPrincipal: e.idEspecialidad === idEspecialidad
            }))
        );
    }

    obtenerNombreEspecialidad(idEspecialidad: number): string {
        return this.especialidades().find(e => e.idEspecialidad === idEspecialidad)?.nombre ?? '';
    }

    cerrar(): void {
        this.dialogRef.close(false);
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.especialidadesAsignadas().length === 0) {
            this.mostrarError('Debe asignar al menos una especialidad.');
            return;
        }

        if (!this.especialidadesAsignadas().some(e => e.esPrincipal)) {
            this.mostrarError('Debe haber exactamente una especialidad principal.');
            return;
        }

        this.cargando.set(true);
        const v = this.form.value;

        if (this.modoEdicion) {
            const dto = {
                cedulaProfesional:   v.cedulaProfesional,
                numeroColegiado:     v.numeroColegiado,
                consultorio:         v.consultorio || null,
                telefonoConsultorio: v.telefonoConsultorio || null,
                observaciones:       v.observaciones || null,
                activo:              true,
                especialidades:      this.especialidadesAsignadas()
            };

            this.medicoService.actualizar(this.idMedico!, dto).subscribe({
                next: () => {
                    this.mostrarExito('Médico actualizado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.errores?.[0] ?? 'Error al actualizar médico.');
                    this.cargando.set(false);
                }
            });
        } else {
            const dto = {
                idUsuario:           v.idUsuario,
                cedulaProfesional:   v.cedulaProfesional,
                numeroColegiado:     v.numeroColegiado,
                consultorio:         v.consultorio || null,
                telefonoConsultorio: v.telefonoConsultorio || null,
                observaciones:       v.observaciones || null,
                especialidades:      this.especialidadesAsignadas()
            };

            this.medicoService.crear(dto).subscribe({
                next: () => {
                    this.mostrarExito('Médico registrado exitosamente.');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.mostrarError(err.error?.errores?.[0] ?? 'Error al registrar médico.');
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

    get idUsuario()         { return this.form.get('idUsuario')!; }
    get cedulaProfesional() { return this.form.get('cedulaProfesional')!; }
    get numeroColegiado()   { return this.form.get('numeroColegiado')!; }
}