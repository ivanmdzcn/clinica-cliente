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

import { ModuloService } from '../../../core/services/seguridad/modulo.service';
import { Modulo } from '../../../core/models/seguridad/modulo.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { ModuloFormComponent } from '../dialog/modulo-form/modulo-form.component';

@Component({
    selector: 'app-modulos',
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
    templateUrl: './modulos.component.html',
    styleUrl: './modulos.component.scss'
})
export class ModulosComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['nombre', 'activo', 'acciones'];
    dataSource = new MatTableDataSource<Modulo>([]);
    cargando = signal(false);

    constructor(
        private moduloService: ModuloService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.cargarModulos();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargarModulos(): void {
        this.cargando.set(true);
        this.moduloService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar módulos.');
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
        const dialogRef = this.dialog.open(ModuloFormComponent, {
            width: '420px',
            maxWidth: '95vw',
            data: null
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarModulos();
        });
    }

    editar(modulo: Modulo): void {
        const dialogRef = this.dialog.open(ModuloFormComponent, {
            width: '420px',
            maxWidth: '95vw',
            data: modulo
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarModulos();
        });
    }

    confirmarEliminar(modulo: Modulo): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Módulo',
                mensaje: `¿Estás seguro de eliminar el módulo "${modulo.nombre}"?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(modulo.idModulo);
        });
    }

    eliminar(id: number): void {
        this.moduloService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Módulo eliminado exitosamente.');
                this.cargarModulos();
            },
            error: (err) => {
                this.mostrarError(err.error?.mensaje ?? 'Error al eliminar módulo.');
            }
        });
    }

    confirmarDesactivar(modulo: Modulo): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Desactivar Módulo',
                mensaje: `¿Desactivar el módulo "${modulo.nombre}"?`,
                btnConfirmar: 'Desactivar',
                color: 'accent'
            }
        });

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.desactivar(modulo.idModulo);
        });
    }

    desactivar(id: number): void {
        this.moduloService.desactivar(id).subscribe({
            next: () => {
                this.mostrarExito('Módulo desactivado exitosamente.');
                this.cargarModulos();
            },
            error: (err) => {
                this.mostrarError(err.error?.mensaje ?? 'Error al desactivar módulo.');
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