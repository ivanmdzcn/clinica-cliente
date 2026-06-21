import { Component, Input, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { OrdenLaboratorioService } from '../../../../../core/services/clinica/orden-laboratorio.service';
import { OrdenLaboratorio, ESTADOS_ORDEN, ESTADOS_DETALLE } from '../../../../../core/models/clinica/orden-laboratorio.model';
import { OrdenLabDialogComponent, OrdenLabDialogData } from '../../orden-lab-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ResultadosDialogComponent, ResultadosDialogData } from '../../../laboratorio/resultados-dialog.component';
import { PermisoDirective } from '../../../../../shared/directives/permiso.directive';

@Component({
    selector: 'app-laboratorio-tab',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
        MatDividerModule,
        PermisoDirective
    ],
    templateUrl: './laboratorio-tab.component.html',
    styleUrl: './laboratorio-tab.component.scss'
})
export class LaboratorioTabComponent implements OnInit {
    @Input({ required: true }) idConsulta!: number;
    @Input({ required: true }) esCerrada: boolean = false;
    @Input({ required: true }) idMedico!: number;
    @Input({ required: true }) idPaciente!: number;

    // Output para notificar el conteo de órdenes al padre
    onCountChange = output<number>();

    ordenesLab = signal<OrdenLaboratorio[]>([]);
    estadosOrden = ESTADOS_ORDEN;
    estadosDetalle = ESTADOS_DETALLE;

    constructor(
        private ordenLabService: OrdenLaboratorioService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.cargarOrdenesLab();
    }

    cargarOrdenesLab(): void {
        this.ordenLabService.obtenerPorConsulta(this.idConsulta).subscribe({
            next: (data: OrdenLaboratorio[]) => {
                this.ordenesLab.set(data);
                this.onCountChange.emit(data.length);
            },
            error: () => this.mostrarError('Error al cargar órdenes de laboratorio.')
        });
    }

    abrirFormOrdenLab(): void {
        const dialogRef = this.dialog.open(OrdenLabDialogComponent, {
            width: '620px',
            maxWidth: '95vw',
            disableClose: true,
            data: { 
                idConsulta: this.idConsulta, 
                idMedico: this.idMedico, 
                idPaciente: this.idPaciente 
            } as OrdenLabDialogData
        });
        dialogRef.afterClosed().subscribe((guardado: any) => {
            if (guardado) this.cargarOrdenesLab();
        });
    }

    confirmarEliminarOrdenLab(orden: OrdenLaboratorio): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Orden',
                mensaje: `¿Eliminar la orden ${orden.numeroOrden}?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe((confirmado: boolean) => {
            if (confirmado) this.eliminarOrdenLab(orden.idOrden);
        });
    }

    eliminarOrdenLab(idOrden: number): void {
        this.ordenLabService.eliminar(idOrden).subscribe({
            next: () => {
                this.mostrarExito('Orden eliminada.');
                this.cargarOrdenesLab();
            },
            error: (err: any) => this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar.')
        });
    }

    obtenerEstadoOrden(valor: string) {
        return this.estadosOrden.find(e => e.value === valor);
    }

    obtenerEstadoDetalle(valor: string) {
        return this.estadosDetalle.find(e => e.value === valor);
    }

    verOrdenLab(idOrden: number): void {
        this.router.navigate(['/clinica/laboratorio', idOrden, 'orden']);
    }

    verResultadosOrden(orden: OrdenLaboratorio): void {
        this.dialog.open(ResultadosDialogComponent, {
            width: '720px',
            maxWidth: '95vw',
            disableClose: false,
            data: { orden } as ResultadosDialogData
        });
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}