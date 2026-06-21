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
import { MedicoService } from '../../../core/services/clinica/medico.service';
import { Medico } from '../../../core/models/clinica/medico.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { MedicoFormComponent } from '../dialog/medico-form/medico-form.component';

@Component({
    selector: 'app-medicos',
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
    templateUrl: './medicos.component.html',
    styleUrl: './medicos.component.scss'
})
export class MedicosComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['nombre', 'cedula', 'colegiado', 'especialidad', 'consultorio', 'activo', 'acciones'];
    dataSource = new MatTableDataSource<Medico>([]);
    cargando = signal(false);

    constructor(
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
        this.cargando.set(true);
        this.medicoService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar médicos.');
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
        const dialogRef = this.dialog.open(MedicoFormComponent, {
            width: '820px',
            maxWidth: '95vw',
            data: null
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarMedicos();
        });
    }

    editar(medico: Medico): void {
        const dialogRef = this.dialog.open(MedicoFormComponent, {
            width: '820px',
            maxWidth: '95vw',
            data: medico.idMedico
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarMedicos();
        });
    }

    confirmarEliminar(medico: Medico): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Médico',
                mensaje: `¿Eliminar al médico "${medico.nombreUsuario}"?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(medico.idMedico);
        });
    }

    eliminar(id: number): void {
        this.medicoService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Médico eliminado exitosamente.');
                this.cargarMedicos();
            },
            error: (err) => {
                this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar médico.');
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