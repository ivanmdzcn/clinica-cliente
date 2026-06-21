import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { CitaService } from '../../../core/services/clinica/cita.service';
import { MedicoService } from '../../../core/services/clinica/medico.service';
import { Cita, ESTADOS_CITA } from '../../../core/models/clinica/cita.model';
import { Medico } from '../../../core/models/clinica/medico.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { NuevaCitaFormComponent, NuevaCitaFormData } from '../dialog/nueva-cita-form/nueva-cita-form.component';
import { EstadoCitaFormComponent, EstadoCitaFormData } from '../dialog/estado-cita-form/estado-cita-form.component';

@Component({
    selector: 'app-citas',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatChipsModule,
        MatDividerModule,
        PermisoDirective
    ],
    templateUrl: './citas.component.html',
    styleUrl: './citas.component.scss'
})
export class CitasComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['paciente', 'medico', 'fecha', 'hora', 'estado', 'acciones'];
    dataSource = new MatTableDataSource<Cita>([]);

    medicos     = signal<Medico[]>([]);
    estadosCita = ESTADOS_CITA;

    // Filtros
    filtroMedico = '';
    filtroEstado = '';
    filtroFecha  = '';

    cargando = signal(false);

    constructor(
        private citaService:   CitaService,
        private medicoService: MedicoService,
        private dialog:        MatDialog,
        private snackBar:      MatSnackBar
    ) {}

    ngOnInit(): void {
        this.cargarCitas();
        this.cargarMedicos();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort      = this.sort;
        this.dataSource.filterPredicate = this.crearFiltro();
    }

    cargarCitas(): void {
        this.cargando.set(true);
        this.citaService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar citas.');
                    this.cargando.set(false);
                }, 300);
            }
        });
    }

    cargarMedicos(): void {
        this.medicoService.obtenerActivos().subscribe({
            next: (data) => this.medicos.set(data)
        });
    }

    // ── Filtros ────────────────────────────────────────────────────────────────

    crearFiltro(): (data: Cita, filter: string) => boolean {
        return (data, filter) => {
            const f = JSON.parse(filter);
            const matchMedico  = !f.medico  || data.idMedico.toString() === f.medico;
            const matchEstado  = !f.estado  || data.estado === f.estado;
            const matchFecha   = !f.fecha   || data.fechaCita === f.fecha;
            return matchMedico && matchEstado && matchFecha;
        };
    }

    aplicarFiltros(): void {
        this.dataSource.filter = JSON.stringify({
            medico: this.filtroMedico,
            estado: this.filtroEstado,
            fecha:  this.filtroFecha
        });
    }

    limpiarFiltros(): void {
        this.filtroMedico = '';
        this.filtroEstado = '';
        this.filtroFecha  = '';
        this.dataSource.filter = '';
    }

    onFechaFiltroChange(event: any): void {
        if (event.value) {
            const d = new Date(event.value);
            this.filtroFecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        } else {
            this.filtroFecha = '';
        }
        this.aplicarFiltros();
    }

    // ── Nueva cita — abre dialog ───────────────────────────────────────────────
    abrirFormNueva(idPacientePreseleccionado?: number): void {
        const dialogRef = this.dialog.open(NuevaCitaFormComponent, {
            width: '680px',
            maxWidth: '95vw',
            data: { idPacientePreseleccionado } as NuevaCitaFormData
        });

        dialogRef.afterClosed().subscribe(creado => {
            if (creado) this.cargarCitas();
        });
    }

    // ── Cambiar estado — abre dialog ──────────────────────────────────────────
    abrirFormEstado(cita: Cita): void {
        const dialogRef = this.dialog.open(EstadoCitaFormComponent, {
            width: '480px',
            maxWidth: '95vw',
            data: { cita } as EstadoCitaFormData
        });

        dialogRef.afterClosed().subscribe(actualizado => {
            if (actualizado) this.cargarCitas();
        });
    }

    // ── Eliminar ───────────────────────────────────────────────────────────────

    confirmarEliminar(cita: Cita): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo:       'Eliminar Cita',
                mensaje:      `¿Eliminar la cita de "${cita.nombrePaciente}" del ${cita.fechaCita}?`,
                btnConfirmar: 'Eliminar',
                color:        'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(cita.idCita);
        });
    }

    eliminar(id: number): void {
        this.citaService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Cita eliminada exitosamente.');
                this.cargarCitas();
            },
            error: (err) => {
                this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar cita.');
            }
        });
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    obtenerEstado(valor: string) {
        return this.estadosCita.find(e => e.value === valor);
    }

    esCitaEditable(cita: Cita): boolean {
        return cita.estado !== 'cancelada' && cita.estado !== 'completada';
    }

    formatearHora(hora: string): string {
        return hora?.substring(0, 5) ?? '';
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}