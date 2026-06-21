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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { EspecialidadService } from '../../../core/services/clinica/especialidad.service';
import { Especialidad } from '../../../core/models/clinica/especialidad.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { EspecialidadFormComponent } from '../dialog/especialidad-form/especialidad-form.component';

@Component({
    selector: 'app-especialidades',
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
    templateUrl: './especialidades.component.html',
    styleUrl: './especialidades.component.scss'
})
export class EspecialidadesComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['nombre', 'descripcion', 'activo', 'acciones'];
    dataSource = new MatTableDataSource<Especialidad>([]);
    cargando = signal(false);

    constructor(
        private especialidadService: EspecialidadService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.cargarEspecialidades();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargarEspecialidades(): void {
        this.cargando.set(true);
        this.especialidadService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar especialidades.');
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
        const dialogRef = this.dialog.open(EspecialidadFormComponent, {
            width: '720px',
            maxWidth: '95vw',
            data: null
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarEspecialidades();
        });
    }

    editar(especialidad: Especialidad): void {
        const dialogRef = this.dialog.open(EspecialidadFormComponent, {
            width: '720px',
            maxWidth: '95vw',
            data: especialidad
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarEspecialidades();
        });
    }

    confirmarEliminar(especialidad: Especialidad): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Especialidad',
                mensaje: `¿Eliminar la especialidad "${especialidad.nombre}"?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(especialidad.idEspecialidad);
        });
    }

    eliminar(id: number): void {
        this.especialidadService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Especialidad eliminada exitosamente.');
                this.cargarEspecialidades();
            },
            error: (err) => {
                this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar.');
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