import { Component, Input, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TratamientoService } from '../../../../../core/services/clinica/tratamiento.service';
import { Tratamiento, TIPOS_TRATAMIENTO, ESTADOS_TRATAMIENTO } from '../../../../../core/models/clinica/tratamiento.model';
import { TratamientoDialogComponent, TratamientoDialogData } from '../../tratamiento-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../../../shared/directives/permiso.directive';

@Component({
    selector: 'app-tratamientos-tab',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
        PermisoDirective
    ],
    templateUrl: './tratamientos-tab.component.html',
    styleUrl: './tratamientos-tab.component.scss'
})
export class TratamientosTabComponent implements OnInit {
    @Input({ required: true }) idConsulta!: number;
    @Input({ required: true }) esCerrada: boolean = false;

    // Emitimos el número de tratamientos activos o registrados al padre
    onCountChange = output<number>();

    tratamientos = signal<Tratamiento[]>([]);
    tiposTratamiento = TIPOS_TRATAMIENTO;
    estadosTratamiento = ESTADOS_TRATAMIENTO;

    constructor(
        private tratamientoService: TratamientoService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.cargarTratamientos();
    }

    cargarTratamientos(): void {
        this.tratamientoService.obtenerPorConsulta(this.idConsulta).subscribe({
            next: (data: Tratamiento[]) => {
                this.tratamientos.set(data);
                this.onCountChange.emit(data.length);
            },
            error: () => this.mostrarError('Error al cargar tratamientos.')
        });
    }

    abrirFormTratamiento(tratamiento?: Tratamiento): void {
        const dialogRef = this.dialog.open(TratamientoDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            disableClose: true,
            data: { 
                idConsulta: this.idConsulta, 
                tratamiento 
            } as TratamientoDialogData
        });
        dialogRef.afterClosed().subscribe((guardado: any) => {
            if (guardado) this.cargarTratamientos();
        });
    }

    confirmarEliminarTratamiento(tratamiento: Tratamiento): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Tratamiento',
                mensaje: `¿Eliminar el tratamiento "${tratamiento.descripcion}"?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe((confirmado: boolean) => {
            if (confirmado) this.eliminarTratamiento(tratamiento.idTratamiento);
        });
    }

    eliminarTratamiento(idTratamiento: number): void {
        this.tratamientoService.eliminar(this.idConsulta, idTratamiento).subscribe({
            next: () => {
                this.mostrarExito('Tratamiento eliminado.');
                this.cargarTratamientos();
            },
            error: (err: any) => this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar.')
        });
    }

    obtenerTipoTratamiento(valor: string) {
        return this.tiposTratamiento.find(t => t.value === valor);
    }

    obtenerEstadoTratamiento(valor: string) {
        return this.estadosTratamiento.find(e => e.value === valor);
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}