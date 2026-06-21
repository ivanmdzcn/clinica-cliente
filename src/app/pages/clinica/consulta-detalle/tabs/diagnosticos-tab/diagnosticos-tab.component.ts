import { Component, Input, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DiagnosticoService } from '../../../../../core/services/clinica/diagnostico.service';
import { Diagnostico, TIPOS_DIAGNOSTICO } from '../../../../../core/models/clinica/diagnostico.model';
import { DiagnosticoDialogComponent, DiagnosticoDialogData } from '../../diagnostico-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../../../shared/directives/permiso.directive';

@Component({
    selector: 'app-diagnosticos-tab',
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
    templateUrl: './diagnosticos-tab.component.html',
    styleUrl: './diagnosticos-tab.component.scss'
})
export class DiagnosticosTabComponent implements OnInit {
    @Input({ required: true }) idConsulta!: number;
    @Input({ required: true }) esCerrada: boolean = false;

    // Output para notificar al componente padre el número de diagnósticos
    onCountChange = output<number>();

    diagnosticos = signal<Diagnostico[]>([]);
    tiposDiagnostico = TIPOS_DIAGNOSTICO;

    constructor(
        private diagnosticoService: DiagnosticoService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.cargarDiagnosticos();
    }

    cargarDiagnosticos(): void {
        this.diagnosticoService.obtenerPorConsulta(this.idConsulta).subscribe({
            next: (data: Diagnostico[]) => {
                this.diagnosticos.set(data);
                // Notificamos el conteo al padre
                this.onCountChange.emit(data.length);
            },
            error: () => this.mostrarError('Error al cargar diagnósticos.')
        });
    }

    abrirFormDiagnostico(diagnostico?: Diagnostico): void {
        const dialogRef = this.dialog.open(DiagnosticoDialogComponent, {
            width: '580px',
            maxWidth: '95vw',
            disableClose: true,
            data: {
                idConsulta: this.idConsulta,
                diagnostico
            } as DiagnosticoDialogData
        });
        dialogRef.afterClosed().subscribe((guardado: any) => {
            if (guardado) this.cargarDiagnosticos();
        });
    }

    confirmarEliminarDiagnostico(diagnostico: Diagnostico): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Diagnóstico',
                mensaje: `¿Eliminar el diagnóstico "${diagnostico.descripcion}"?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe((confirmado: boolean) => {
            if (confirmado) this.eliminarDiagnostico(diagnostico.idDiagnostico);
        });
    }

    eliminarDiagnostico(idDiagnostico: number): void {
        this.diagnosticoService.eliminar(this.idConsulta, idDiagnostico).subscribe({
            next: () => {
                this.mostrarExito('Diagnóstico eliminado.');
                this.cargarDiagnosticos();
            },
            error: (err: any) => this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar.')
        });
    }

    obtenerTipoDiagnostico(valor: string) {
        return this.tiposDiagnostico.find(t => t.value === valor);
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}