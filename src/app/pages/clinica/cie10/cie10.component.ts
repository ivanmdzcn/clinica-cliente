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
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Cie10Service } from '../../../core/services/clinica/cie10.service';
import { Cie10 } from '../../../core/models/clinica/cie10.model';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Cie10FormComponent } from '../dialog/cie10-form/cie10-form.component';

@Component({
    selector: 'app-cie10',
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
        MatSelectModule,
        MatChipsModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatDialogModule,
        PermisoDirective
    ],
    templateUrl: './cie10.component.html',
    styleUrl: './cie10.component.scss'
})
export class Cie10Component implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['codigo', 'descripcion', 'categoria', 'tipo', 'acciones'];
    dataSource = new MatTableDataSource<Cie10>([]);

    terminoBusqueda = '';
    private busqueda = new Subject<string>();

    categorias = signal<string[]>([]);
    filtroCategoria = '';

    cargando = signal(false);

    constructor(
        private cie10Service: Cie10Service,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.cargarCatalogo();
        this.configurarBusqueda();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.crearFiltro();
    }

    cargarCatalogo(): void {
        this.cargando.set(true);
        this.cie10Service.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    const cats = [...new Set(data
                        .map(d => d.categoria)
                        .filter((c): c is string => !!c)
                    )].sort();
                    this.categorias.set(cats);
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar el catálogo CIE-10.');
                    this.cargando.set(false);
                }, 300);
            }
        });
    }

    // ── Búsqueda con debounce ─────────────────────────────────────────────────
    configurarBusqueda(): void {
        this.busqueda.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(termino => {
            this.aplicarFiltros();
        });
    }

    onBusqueda(termino: string): void {
        this.terminoBusqueda = termino;
        this.busqueda.next(termino);
    }

    // ── Filtros ───────────────────────────────────────────────────────────────
    crearFiltro(): (data: Cie10, filter: string) => boolean {
        return (data: Cie10, filter: string) => {
            const f = JSON.parse(filter);
            const termino = f.termino?.toLowerCase() ?? '';
            const matchTermino = !termino ||
                data.codigo.toLowerCase().includes(termino) ||
                data.descripcion.toLowerCase().includes(termino) ||
                (data.categoria?.toLowerCase().includes(termino) ?? false);
            const matchCategoria = !f.categoria ||
                data.categoria === f.categoria;
            return matchTermino && matchCategoria;
        };
    }

    aplicarFiltros(): void {
        this.dataSource.filter = JSON.stringify({
            termino: this.terminoBusqueda,
            categoria: this.filtroCategoria
        });
    }

    limpiarFiltros(): void {
        this.terminoBusqueda = '';
        this.filtroCategoria = '';
        this.dataSource.filter = '';
    }

    // ── Nuevo código — abre dialog ──────────────────────────────────────────────
    abrirForm(): void {
        const dialogRef = this.dialog.open(Cie10FormComponent, {
            width: '600px',
            maxWidth: '95vw'
        });

        dialogRef.afterClosed().subscribe(creado => {
            if (creado) this.cargarCatalogo();
        });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}