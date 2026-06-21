import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ConsultaService } from '../../../core/services/clinica/consulta.service';
import { MedicoService } from '../../../core/services/clinica/medico.service';
import { PacienteService } from '../../../core/services/clinica/paciente.service';
import { Consulta, TIPOS_CONSULTA, ESTADOS_CONSULTA }
    from '../../../core/models/clinica/consulta.model';
import { Medico } from '../../../core/models/clinica/medico.model';
import { Paciente } from '../../../core/models/clinica/paciente.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { EditarConsultaDialogComponent } from './editar-consulta-dialog.component';
import { EstadoConsultaDialogComponent } from './estado-consulta-dialog.component';
import { NuevaConsultaDialogComponent } from './nueva-consulta-dialog.component';

@Component({
    selector: 'app-consultas',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
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
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatChipsModule,
        PermisoDirective
    ],
    templateUrl: './consultas.component.html',
    styleUrl: './consultas.component.scss'
})
export class ConsultasComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['fecha', 'paciente', 'medico', 'tipo', 'motivo', 'estado', 'acciones'];
    dataSource = new MatTableDataSource<Consulta>([]);

    medicos = signal<Medico[]>([]);
    pacientes = signal<Paciente[]>([]);
    tiposConsulta = TIPOS_CONSULTA;
    estadosConsulta = ESTADOS_CONSULTA;

    // Filtros
    filtroMedico = '';
    filtroEstado = '';
    filtroPaciente = '';

    cargando = signal(false);

    constructor(
        private consultaService: ConsultaService,
        private medicoService: MedicoService,
        private pacienteService: PacienteService,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.cargarConsultas();
        this.cargarMedicos();
        this.cargarPacientes();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.crearFiltro();
    }

    // ── Nueva consulta — abre dialog ──────────────────────────────────────────
    abrirNuevo(): void {
        const dialogRef = this.dialog.open(NuevaConsultaDialogComponent, {
            width: '720px',
            maxWidth: '95vw',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(creado => {
            if (creado) this.cargarConsultas();
        });
    }

    // ── Carga ─────────────────────────────────────────────────────────────────
    cargarConsultas(): void {
        this.cargando.set(true);
        this.consultaService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar consultas.');
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

    cargarPacientes(): void {
        this.pacienteService.obtenerTodos().subscribe({
            next: (data) => this.pacientes.set(data.filter((p: Paciente) => p.activo))
        });
    }

    // ── Filtros ───────────────────────────────────────────────────────────────
    crearFiltro(): (data: Consulta, filter: string) => boolean {
        return (data: Consulta, filter: string) => {
            const f = JSON.parse(filter);
            const matchMedico = !f.medico || data.idMedico.toString() === f.medico;
            const matchEstado = !f.estado || data.estado === f.estado;
            const matchPaciente = !f.paciente || data.idPaciente.toString() === f.paciente;
            return matchMedico && matchEstado && matchPaciente;
        };
    }

    aplicarFiltros(): void {
        this.dataSource.filter = JSON.stringify({
            medico: this.filtroMedico,
            estado: this.filtroEstado,
            paciente: this.filtroPaciente
        });
    }

    limpiarFiltros(): void {
        this.filtroMedico = '';
        this.filtroEstado = '';
        this.filtroPaciente = '';
        this.dataSource.filter = '';
    }

    // ── Editar — abre dialog ──────────────────────────────────────────────────
    abrirEdicion(consulta: Consulta): void {
        const dialogRef = this.dialog.open(EditarConsultaDialogComponent, {
            width: '680px',
            maxWidth: '95vw',
            data: { consulta },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(actualizado => {
            if (actualizado) this.cargarConsultas();
        });
    }

    // ── Cambiar estado — abre dialog ──────────────────────────────────────────
    abrirCambioEstado(consulta: Consulta): void {
        const dialogRef = this.dialog.open(EstadoConsultaDialogComponent, {
            width: '440px',
            maxWidth: '95vw',
            data: { consulta },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(actualizado => {
            if (actualizado) this.cargarConsultas();
        });
    }

    // ── Eliminar ──────────────────────────────────────────────────────────────
    confirmarEliminar(consulta: Consulta): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Consulta',
                mensaje: `¿Eliminar la consulta de "${consulta.nombrePaciente}"?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(consulta.idConsulta);
        });
    }

    eliminar(id: number): void {
        this.consultaService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Consulta eliminada exitosamente.');
                this.cargarConsultas();
            },
            error: (err) => this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar.')
        });
    }

    // ── Historial ─────────────────────────────────────────────────────────────
    verHistoria(consulta: Consulta): void {
        this.router.navigate(['/clinica/pacientes', consulta.idPaciente, 'historia']);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    obtenerEstado(valor: string) {
        return this.estadosConsulta.find(e => e.value === valor);
    }

    obtenerLabelTipo(valor: string | null): string {
        return this.tiposConsulta.find(t => t.value === valor)?.label ?? '—';
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}