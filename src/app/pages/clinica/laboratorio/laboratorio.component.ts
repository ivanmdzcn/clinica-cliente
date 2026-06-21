import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrdenLaboratorioService } from '../../../core/services/clinica/orden-laboratorio.service';
import { OrdenLaboratorio, ESTADOS_ORDEN, CambiarEstadoOrden }
    from '../../../core/models/clinica/orden-laboratorio.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { ResultadosDialogComponent, ResultadosDialogData }
    from './resultados-dialog.component';

@Component({
    selector: 'app-laboratorio',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
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
        MatDialogModule,
        MatSnackBarModule,
        PermisoDirective
    ],
    templateUrl: './laboratorio.component.html',
    styleUrl: './laboratorio.component.scss'
})
export class LaboratorioComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['urgente', 'numeroOrden', 'paciente', 'medico', 'fecha',
        'examenes', 'estado', 'acciones'];
    dataSource = new MatTableDataSource<OrdenLaboratorio>([]);

    estadosOrden = ESTADOS_ORDEN;
    estadoActual = signal<string>('pendiente');
    cargando = signal(false);
    terminoBusqueda = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ordenService: OrdenLaboratorioService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        // Leer estado de la ruta o default pendiente
        this.route.data.subscribe(data => {
            const estado = data['estado'] ?? 'pendiente';
            this.estadoActual.set(estado);
            this.cargarOrdenes();
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: OrdenLaboratorio, filter: string) => {
            const t = filter.toLowerCase();
            return data.numeroOrden.toLowerCase().includes(t) ||
                (data.nombrePaciente?.toLowerCase().includes(t) ?? false) ||
                (data.nombreMedico?.toLowerCase().includes(t) ?? false);
        };
    }

    cargarOrdenes(): void {
        this.cargando.set(true);
        this.ordenService.obtenerPorEstado(this.estadoActual()).subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar órdenes.');
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

    // ── Procesar orden → captura de resultados ────────────────────────────────
    procesarOrden(orden: OrdenLaboratorio): void {
        const dialogRef = this.dialog.open(ResultadosDialogComponent, {
            width: '720px',
            maxWidth: '95vw',
            disableClose: true,
            data: { orden } as ResultadosDialogData
        });
        dialogRef.afterClosed().subscribe(guardado => {
            if (guardado) this.cargarOrdenes();
        });
    }

    // ── Cambiar estado ────────────────────────────────────────────────────────
    marcarEnProceso(orden: OrdenLaboratorio): void {
        const dto: CambiarEstadoOrden = { estado: 'en_proceso', observacion: null };
        this.ordenService.cambiarEstado(orden.idOrden, dto).subscribe({
            next: () => {
                this.mostrarExito('Orden marcada como "En Proceso".');
                this.cargarOrdenes();
            },
            error: (err) => this.mostrarError(err.error?.errores?.[0] ?? 'Error.')
        });
    }

    cancelarOrden(orden: OrdenLaboratorio): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Cancelar Orden',
                mensaje: `¿Cancelar la orden ${orden.numeroOrden}?`,
                btnConfirmar: 'Cancelar Orden',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmado => {
            if (!confirmado) return;
            const dto: CambiarEstadoOrden = { estado: 'cancelada', observacion: null };
            this.ordenService.cambiarEstado(orden.idOrden, dto).subscribe({
                next: () => {
                    this.mostrarExito('Orden cancelada.');
                    this.cargarOrdenes();
                },
                error: (err) => this.mostrarError(err.error?.errores?.[0] ?? 'Error.')
            });
        });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    get tituloSeccion(): string {
        const titulos: Record<string, string> = {
            'pendiente': 'Órdenes Pendientes',
            'en_proceso': 'Órdenes En Proceso',
            'completada': 'Órdenes Completadas',
            'cancelada': 'Órdenes Canceladas'
        };
        return titulos[this.estadoActual()] ?? 'Órdenes de Laboratorio';
    }

    get iconoSeccion(): string {
        const iconos: Record<string, string> = {
            'pendiente': 'pending_actions',
            'en_proceso': 'autorenew',
            'completada': 'task_alt',
            'cancelada': 'cancel'
        };
        return iconos[this.estadoActual()] ?? 'biotech';
    }

    obtenerEstado(valor: string) {
        return this.estadosOrden.find(e => e.value === valor);
    }

    private mostrarExito(msg: string): void {
        this.snackBar.open(msg, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(msg: string): void {
        this.snackBar.open(msg, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }

    // Imprimir orden
    // verOrden(idOrden: number): void {
    //     window.open(`/clinica/laboratorio/${idOrden}/orden`, '_blank');
    // }
    verOrden(idOrden: number): void {
        this.router.navigate(['/clinica/laboratorio', idOrden, 'orden']);
    }
}