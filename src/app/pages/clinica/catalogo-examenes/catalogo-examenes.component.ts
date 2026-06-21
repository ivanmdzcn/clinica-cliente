import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CatalogoExamenService } from '../../../core/services/clinica/catalogo-examen.service';
import { CatalogoExamen } from '../../../core/models/clinica/catalogo-examen.model';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { CatalogoExamenFormComponent } from '../dialog/catalogo-examen-form/catalogo-examen-form.component';

@Component({
    selector: 'app-catalogo-examenes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatDialogModule,
        PermisoDirective
    ],
    templateUrl: './catalogo-examenes.component.html',
    styleUrl: './catalogo-examenes.component.scss'
})
export class CatalogoExamenesComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['codigo', 'nombre', 'descripcion', 'parametros', 'acciones'];
    dataSource = new MatTableDataSource<CatalogoExamen>([]);

    terminoBusqueda = '';
    cargando = signal(false);

    examenSeleccionado = signal<CatalogoExamen | null>(null);

    constructor(
        private catalogoService: CatalogoExamenService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.cargarCatalogo();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: CatalogoExamen, filter: string) => {
            const t = filter.toLowerCase();
            return data.nombre.toLowerCase().includes(t) ||
                data.codigo.toLowerCase().includes(t) ||
                (data.descripcion?.toLowerCase().includes(t) ?? false);
        };
    }

    cargarCatalogo(): void {
        this.cargando.set(true);
        this.catalogoService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar el catálogo de exámenes.');
                    this.cargando.set(false);
                }, 300);
            }
        });
    }

    aplicarBusqueda(): void {
        this.dataSource.filter = this.terminoBusqueda.trim().toLowerCase();
    }

    limpiarBusqueda(): void {
        this.terminoBusqueda = '';
        this.dataSource.filter = '';
    }

    // ── Nuevo examen — abre dialog ───────────────────────────────────────────
    abrirForm(): void {
        const dialogRef = this.dialog.open(CatalogoExamenFormComponent, {
            width: '900px',
            maxWidth: '95vw'
        });

        dialogRef.afterClosed().subscribe(creado => {
            if (creado) this.cargarCatalogo();
        });
    }

    verParametros(examen: CatalogoExamen): void {
        this.examenSeleccionado.set(
            this.examenSeleccionado()?.idExamen === examen.idExamen ? null : examen
        );
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}