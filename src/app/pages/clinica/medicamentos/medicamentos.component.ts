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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MedicamentoService } from '../../../core/services/clinica/medicamento.service';
import { Medicamento, TIPOS_MEDICAMENTO } from '../../../core/models/clinica/medicamento.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { MedicamentoFormComponent } from '../dialog/medicamento-form/medicamento-form.component';

@Component({
    selector: 'app-medicamentos',
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
        MatDialogModule,
        MatSnackBarModule,
        PermisoDirective
    ],
    templateUrl: './medicamentos.component.html',
    styleUrl: './medicamentos.component.scss'
})
export class MedicamentosComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnas = ['nombre', 'concentracion', 'presentacion', 'tipo', 'receta', 'acciones'];
    dataSource = new MatTableDataSource<Medicamento>([]);

    tiposMedicamento = TIPOS_MEDICAMENTO;

    terminoBusqueda = '';
    filtroTipo = '';

    cargando = signal(false);

    constructor(
        private medicamentoService: MedicamentoService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.cargarMedicamentos();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.crearFiltro();
    }

    cargarMedicamentos(): void {
        this.cargando.set(true);
        this.medicamentoService.obtenerTodos().subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.dataSource.data = data;
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar medicamentos.');
                    this.cargando.set(false);
                }, 300);
            }
        });
    }

    // ── Filtros ───────────────────────────────────────────────────────────────
    crearFiltro(): (data: Medicamento, filter: string) => boolean {
        return (data: Medicamento, filter: string) => {
            const f = JSON.parse(filter);
            const t = f.termino?.toLowerCase() ?? '';
            const matchTermino = !t ||
                data.nombre.toLowerCase().includes(t) ||
                (data.nombreComercial?.toLowerCase().includes(t) ?? false) ||
                (data.laboratorio?.toLowerCase().includes(t) ?? false) ||
                (data.concentracion?.toLowerCase().includes(t) ?? false);
            const matchTipo = !f.tipo || data.tipoMedicamento === f.tipo;
            return matchTermino && matchTipo;
        };
    }

    aplicarFiltros(): void {
        this.dataSource.filter = JSON.stringify({
            termino: this.terminoBusqueda,
            tipo: this.filtroTipo
        });
    }

    limpiarFiltros(): void {
        this.terminoBusqueda = '';
        this.filtroTipo = '';
        this.dataSource.filter = '';
    }

    // ── Formulario — abre dialog ─────────────────────────────────────────────
    abrirNuevo(): void {
        const dialogRef = this.dialog.open(MedicamentoFormComponent, {
            width: '760px',
            maxWidth: '95vw',
            data: null
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarMedicamentos();
        });
    }

    abrirEdicion(med: Medicamento): void {
        const dialogRef = this.dialog.open(MedicamentoFormComponent, {
            width: '760px',
            maxWidth: '95vw',
            data: med
        });

        dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) this.cargarMedicamentos();
        });
    }

    confirmarEliminar(med: Medicamento): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Medicamento',
                mensaje: `¿Eliminar "${med.nombre}"?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) this.eliminar(med.idMedicamento);
        });
    }

    eliminar(id: number): void {
        this.medicamentoService.eliminar(id).subscribe({
            next: () => {
                this.mostrarExito('Medicamento eliminado exitosamente.');
                this.cargarMedicamentos();
            },
            error: (err) => this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar.')
        });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    obtenerTipo(valor: string) {
        return this.tiposMedicamento.find(t => t.value === valor);
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}