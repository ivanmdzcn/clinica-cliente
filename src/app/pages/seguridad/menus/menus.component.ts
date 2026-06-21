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

import { MenuService } from '../../../core/services/seguridad/menu.service';
import { ModuloService } from '../../../core/services/seguridad/modulo.service';
import { Menu } from '../../../core/models/seguridad/menu.model';
import { Modulo } from '../../../core/models/seguridad/modulo.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { MenuFormComponent } from '../dialog/menu-form/menu-form.component';

@Component({
    selector: 'app-menus',
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
    templateUrl: './menus.component.html',
    styleUrl: './menus.component.scss'
})
export class MenusComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['nombre', 'modulo', 'padre', 'ruta', 'orden', 'activo', 'acciones'];
    dataSource = new MatTableDataSource<Menu>([]);
    modulos = signal<Modulo[]>([]);
    menus = signal<Menu[]>([]);
    cargando = signal(false);

    constructor(
        private menuService: MenuService,
        private moduloService: ModuloService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.cargarMenus();
        this.cargarModulos();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargarMenus(): void {
        this.cargando.set(true);
        this.menuService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.menus.set(data);
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar menús.');
                    this.cargando.set(false);
                }, 300);
            }
        });
    }

    cargarModulos(): void {
        this.moduloService.obtenerTodos().subscribe({
            next: (data) => this.modulos.set(data.filter(m => m.activo))
        });
    }

    filtrar(event: Event): void {
        const valor = (event.target as HTMLInputElement).value;
        this.dataSource.filter = valor.trim().toLowerCase();
    }

    obtenerNombreModulo(idModulo: number): string {
        return this.modulos().find(m => m.idModulo === idModulo)?.nombre ?? '—';
    }

    obtenerNombrePadre(idPadre: number | null): string {
        if (!idPadre) return '—';
        return this.menus().find(m => m.idMenu === idPadre)?.nombre ?? '—';
    }

    abrirFormulario(): void {
        const dialogRef = this.dialog.open(MenuFormComponent, {
            width: '640px',
            maxWidth: '95vw',
            data: null
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarMenus();
        });
    }

    editar(menu: Menu): void {
        const dialogRef = this.dialog.open(MenuFormComponent, {
            width: '640px',
            maxWidth: '95vw',
            data: menu
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarMenus();
        });
    }

    confirmarEliminar(menu: Menu): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo:       'Eliminar Menú',
                mensaje:      `¿Estás seguro de eliminar el menú "${menu.nombre}"?`,
                btnConfirmar: 'Eliminar',
                color:        'warn'
            }
        });

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(menu.idMenu);
        });
    }

    eliminar(id: number): void {
        this.menuService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Menú eliminado exitosamente.');
                this.cargarMenus();
            },
            error: (err) => {
                this.mostrarError(err.error?.mensaje ?? 'Error al eliminar menú.');
            }
        });
    }

    confirmarDesactivar(menu: Menu): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo:       'Desactivar Menú',
                mensaje:      `¿Desactivar el menú "${menu.nombre}"?`,
                btnConfirmar: 'Desactivar',
                color:        'accent'
            }
        });

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.desactivar(menu.idMenu);
        });
    }

    desactivar(id: number): void {
        this.menuService.desactivar(id).subscribe({
            next: () => {
                this.mostrarExito('Menú desactivado exitosamente.');
                this.cargarMenus();
            },
            error: (err) => {
                this.mostrarError(err.error?.mensaje ?? 'Error al desactivar menú.');
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