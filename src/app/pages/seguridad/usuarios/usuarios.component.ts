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

import { UsuarioService } from '../../../core/services/seguridad/usuario.service';
import { RolService } from '../../../core/services/seguridad/rol.service';
import { Usuario } from '../../../core/models/seguridad/usuario.model';
import { Rol } from '../../../core/models/seguridad/rol.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { UsuarioFormComponent } from '../dialog/usuario-form/usuario-form.component';

@Component({
    selector: 'app-usuarios',
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
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['nombre', 'nombreUsuario', 'email', 'rol', 'activo', 'acciones'];
    dataSource = new MatTableDataSource<Usuario>([]);
    roles = signal<Rol[]>([]);
    cargando = signal(false);

    constructor(
        private usuarioService: UsuarioService,
        private rolService: RolService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cargarUsuarios();
        this.cargarRoles();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    // cargarUsuarios(): void {
    //     this.cargando.set(true);
    //     this.usuarioService.obtenerTodos().subscribe({
    //         next: (data) => {
    //             this.dataSource.data = data;
    //             this.cargando.set(false);
    //         },
    //         error: () => {
    //             this.mostrarError('Error al cargar usuarios.');
    //             this.cargando.set(false);
    //         }
    //     });
    // }
    cargarUsuarios(): void {
        this.cargando.set(true);
        this.usuarioService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar usuarios.');
                    this.cargando.set(false);
                }, 300);
            }
        });
    }

    cargarRoles(): void {
        this.rolService.obtenerTodos().subscribe({
            next: (data) => this.roles.set(data.filter(r => r.activo))
        });
    }

    filtrar(event: Event): void {
        const valor = (event.target as HTMLInputElement).value;
        this.dataSource.filter = valor.trim().toLowerCase();
    }

    obtenerNombreRol(idRol: number | null): string {
        if (!idRol) return '—';
        return this.roles().find(r => r.idRol === idRol)?.nombre ?? '—';
    }

    abrirFormulario(): void {
        const dialogRef = this.dialog.open(UsuarioFormComponent, {
            width: '860px',
            maxWidth: '95vw',
            data: null
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarUsuarios();
        });
    }

    editar(usuario: Usuario): void {
        const dialogRef = this.dialog.open(UsuarioFormComponent, {
            width: '860px',
            maxWidth: '95vw',
            data: usuario
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarUsuarios();
        });
    }

    confirmarEliminar(usuario: Usuario): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            maxWidth: '95vw',
            data: {
                titulo: 'Eliminar Usuario',
                mensaje: `¿Estás seguro de eliminar al usuario "${usuario.nombre}"?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(usuario.idUsuario);
        });
    }

    eliminar(id: number): void {
        this.usuarioService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Usuario eliminado exitosamente.');
                this.cargarUsuarios();
            },
            error: (err) => {
                this.mostrarError(err.error?.mensaje ?? 'Error al eliminar usuario.');
            }
        });
    }

    confirmarDesactivar(usuario: Usuario): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            maxWidth: '95vw',
            data: {
                titulo: 'Desactivar Usuario',
                mensaje: `¿Desactivar al usuario "${usuario.nombre}"?`,
                btnConfirmar: 'Desactivar',
                color: 'accent'
            }
        });

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.desactivar(usuario.idUsuario);
        });
    }

    desactivar(id: number): void {
        this.usuarioService.desactivar(id).subscribe({
            next: () => {
                this.mostrarExito('Usuario desactivado exitosamente.');
                this.cargarUsuarios();
            },
            error: (err) => {
                this.mostrarError(err.error?.mensaje ?? 'Error al desactivar usuario.');
            }
        });
    }

    irAConfiguracion(usuario: Usuario): void {
        this.router.navigate(['/seguridad/usuarios', usuario.idUsuario, 'configuracion']);
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}