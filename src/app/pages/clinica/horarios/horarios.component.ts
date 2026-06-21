import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { HorarioMedicoService } from '../../../core/services/clinica/horario-medico.service';
import { MedicoService } from '../../../core/services/clinica/medico.service';
import { HorarioMedico, DIAS_SEMANA } from '../../../core/models/clinica/horario-medico.model';
import { Medico } from '../../../core/models/clinica/medico.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { HorarioFormComponent, HorarioFormData } from '../dialog/horario-form/horario-form.component';

@Component({
    selector: 'app-horarios',
    standalone: true,
    imports: [
        CommonModule,
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
    templateUrl: './horarios.component.html',
    styleUrl: './horarios.component.scss'
})
export class HorariosComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['medico', 'dia', 'horaInicio', 'horaFin', 'duracion', 'activo', 'acciones'];
    dataSource = new MatTableDataSource<HorarioMedico>([]);

    medicos = signal<Medico[]>([]);
    diasSemana = DIAS_SEMANA;
    medicoSeleccionado = signal<number | null>(null);

    cargando = signal(false);

    constructor(
        private horarioService: HorarioMedicoService,
        private medicoService: MedicoService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.cargarMedicos();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargarMedicos(): void {
        this.medicoService.obtenerActivos().subscribe({
            next: (data) => this.medicos.set(data)
        });
    }

    cargarHorarios(idMedico: number): void {
        this.cargando.set(true);
        this.horarioService.obtenerPorMedico(idMedico).subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar horarios.');
                    this.cargando.set(false);
                }, 300);
            }
        });
    }

    onMedicoChange(idMedico: number): void {
        this.medicoSeleccionado.set(idMedico);
        this.cargarHorarios(idMedico);
    }

    abrirFormulario(): void {
        const idMedico = this.medicoSeleccionado();
        if (!idMedico) return;

        const dialogRef = this.dialog.open(HorarioFormComponent, {
            width: '600px',
            maxWidth: '95vw',
            data: { idMedico, horario: null } as HorarioFormData
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarHorarios(idMedico);
        });
    }

    editar(horario: HorarioMedico): void {
        const dialogRef = this.dialog.open(HorarioFormComponent, {
            width: '600px',
            maxWidth: '95vw',
            data: { idMedico: horario.idMedico, horario } as HorarioFormData
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarHorarios(horario.idMedico);
        });
    }

    confirmarEliminar(horario: HorarioMedico): void {
        const dia = this.diasSemana.find(d => d.value === horario.diaSemana)?.label ?? '';
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Horario',
                mensaje: `¿Eliminar el horario del ${dia}?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(horario);
        });
    }

    eliminar(horario: HorarioMedico): void {
        this.horarioService.eliminar(horario.idMedico, horario.idHorario).subscribe({
            next: () => {
                this.mostrarExito('Horario eliminado exitosamente.');
                this.cargarHorarios(horario.idMedico);
            },
            error: (err) => {
                this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar horario.');
            }
        });
    }

    obtenerLabelDia(diaSemana: number): string {
        return this.diasSemana.find(d => d.value === diaSemana)?.label ?? '';
    }

    formatearHora(hora: string): string {
        return hora?.substring(0, 5) ?? '';
    }

    calcularSlots(horario: HorarioMedico): number {
        if (!horario.horaInicio || !horario.horaFin) return 0;
        const [h1, m1] = horario.horaInicio.split(':').map(Number);
        const [h2, m2] = horario.horaFin.split(':').map(Number);
        const minutos = (h2 * 60 + m2) - (h1 * 60 + m1);
        return Math.floor(minutos / horario.duracionSlotMin);
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}