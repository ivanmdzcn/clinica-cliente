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

import { PermisoService } from '../../../core/services/seguridad/permiso.service';
import { Permiso } from '../../../core/models/seguridad/permiso.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { PermisoFormComponent } from '../dialog/permiso-form/permiso-form.component';

@Component({
    selector: 'app-permisos',
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
        PermisoDirective
    ],
    templateUrl: './permisos.component.html',
    styleUrl: './permisos.component.scss'
})
export class PermisosComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['nombre', 'nombreMenu', 'acciones'];
    dataSource = new MatTableDataSource<Permiso>([]);
    cargando = signal(false);

    constructor(
        private permisoService: PermisoService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.cargarPermisos();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargarPermisos(): void {
        this.cargando.set(true);
        this.permisoService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar permisos.');
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
        const dialogRef = this.dialog.open(PermisoFormComponent, {
            width: '560px',
            maxWidth: '95vw',
            data: null
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarPermisos();
        });
    }

    editar(permiso: Permiso): void {
        const dialogRef = this.dialog.open(PermisoFormComponent, {
            width: '560px',
            maxWidth: '95vw',
            data: permiso
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarPermisos();
        });
    }

    confirmarEliminar(permiso: Permiso): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Permiso',
                mensaje: `¿Estás seguro de eliminar el permiso "${permiso.nombre}"?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(permiso.idPermiso);
        });
    }

    eliminar(id: number): void {
        this.permisoService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Permiso eliminado exitosamente.');
                this.cargarPermisos();
            },
            error: (err) => {
                this.mostrarError(err.error?.mensaje ?? 'Error al eliminar permiso.');
            }
        });
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
        });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 4000,
            panelClass: ['snack-error']
        });
    }
}