import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { PacienteService } from '../../../core/services/clinica/paciente.service';
import { Paciente, SEXOS } from '../../../core/models/clinica/paciente.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { PacienteFormComponent } from '../dialog/paciente-form/paciente-form.component';

@Component({
    selector: 'app-pacientes',
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
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatChipsModule,
        PermisoDirective
    ],
    templateUrl: './pacientes.component.html',
    styleUrl: './pacientes.component.scss'
})
export class PacientesComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['nombreCompleto', 'dpi', 'sexo', 'telefono', 'tipoSangre', 'activo', 'acciones'];
    dataSource = new MatTableDataSource<Paciente>([]);

    sexos = SEXOS;
    cargando = signal(false);

    constructor(
        private pacienteService: PacienteService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cargarPacientes();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargarPacientes(): void {
        this.cargando.set(true);
        this.pacienteService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar pacientes.');
                    this.cargando.set(false);
                }, 300);
            }
        });
    }

    filtrar(event: Event): void {
        const valor = (event.target as HTMLInputElement).value;
        this.dataSource.filter = valor.trim().toLowerCase();
    }

    abrirFormulario(): void {
        const dialogRef = this.dialog.open(PacienteFormComponent, {
            width: '720px',
            maxWidth: '95vw',
            data: null
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarPacientes();
        });
    }

    editar(paciente: Paciente): void {
        const dialogRef = this.dialog.open(PacienteFormComponent, {
            width: '720px',
            maxWidth: '95vw',
            data: paciente.idPaciente
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarPacientes();
        });
    }

    confirmarEliminar(paciente: Paciente): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Paciente',
                mensaje: `¿Estás seguro de eliminar al paciente "${paciente.nombreCompleto}"?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(paciente.idPaciente);
        });
    }

    eliminar(id: number): void {
        this.pacienteService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Paciente eliminado exitosamente.');
                this.cargarPacientes();
            },
            error: (err) => {
                this.mostrarError(err.error?.mensaje ?? 'Error al eliminar paciente.');
            }
        });
    }

    confirmarDesactivar(paciente: Paciente): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Desactivar Paciente',
                mensaje: `¿Desactivar al paciente "${paciente.nombreCompleto}"?`,
                btnConfirmar: 'Desactivar',
                color: 'accent'
            }
        });

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.desactivar(paciente.idPaciente);
        });
    }

    desactivar(id: number): void {
        this.pacienteService.desactivar(id).subscribe({
            next: () => {
                this.mostrarExito('Paciente desactivado exitosamente.');
                this.cargarPacientes();
            },
            error: (err) => {
                this.mostrarError(err.error?.mensaje ?? 'Error al desactivar paciente.');
            }
        });
    }

    obtenerLabelSexo(valor: string): string {
        return this.sexos.find(s => s.value === valor)?.label ?? valor;
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }

    irAHistoria(paciente: Paciente): void {
        this.router.navigate(['/clinica/pacientes', paciente.idPaciente, 'historia']);
    }
}