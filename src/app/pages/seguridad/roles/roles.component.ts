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

import { RolService } from '../../../core/services/seguridad/rol.service';
import { Rol } from '../../../core/models/seguridad/rol.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { RolFormComponent } from '../dialog/rol-form/rol-form.component';

@Component({
  selector: 'app-roles',
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
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columnas = ['nombre', 'descripcion', 'activo', 'fechaCreacion', 'acciones'];
  dataSource = new MatTableDataSource<Rol>([]);
  cargando = signal(false);

  constructor(
    private rolService: RolService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarRoles();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarRoles(): void {
    this.cargando.set(true);
    this.rolService.obtenerTodos().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.dataSource.data = data;
          this.cargando.set(false);
        }, 300);
      },
      error: () => {
        setTimeout(() => {
          this.mostrarError('Error al cargar roles.');
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
    const dialogRef = this.dialog.open(RolFormComponent, {
      width: '860px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarRoles();
    });
  }

  editar(rol: Rol): void {
    const dialogRef = this.dialog.open(RolFormComponent, {
      width: '860px',
      maxWidth: '95vw',
      data: rol
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarRoles();
    });
  }

  confirmarEliminar(rol: Rol): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      maxWidth: '95vw',
      data: {
        titulo: 'Eliminar Rol',
        mensaje: `¿Estás seguro de eliminar el rol "${rol.nombre}"?`,
        btnConfirmar: 'Eliminar',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) this.eliminar(rol.idRol);
    });
  }

  eliminar(id: number): void {
    this.rolService.eliminar(id).subscribe({
      next: () => {
        this.mostrarExito('Rol eliminado exitosamente.');
        this.cargarRoles();
      },
      error: (err) => {
        this.mostrarError(err.error?.mensaje ?? 'Error al eliminar rol.');
      }
    });
  }

  confirmarDesactivar(rol: Rol): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      maxWidth: '95vw',
      data: {
        titulo: 'Desactivar Rol',
        mensaje: `¿Desactivar el rol "${rol.nombre}"?`,
        btnConfirmar: 'Desactivar',
        color: 'accent'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) this.desactivar(rol.idRol);
    });
  }

  desactivar(id: number): void {
    this.rolService.desactivar(id).subscribe({
      next: () => {
        this.mostrarExito('Rol desactivado exitosamente.');
        this.cargarRoles();
      },
      error: (err) => {
        this.mostrarError(err.error?.mensaje ?? 'Error al desactivar rol.');
      }
    });
  }

  irAConfiguracion(rol: Rol): void {
    this.router.navigate(['/seguridad/roles', rol.idRol, 'configuracion']);
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
  }
}