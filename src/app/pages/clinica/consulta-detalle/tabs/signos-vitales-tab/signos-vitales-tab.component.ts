import { Component, Input, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { SignosVitalesService } from '../../../../../core/services/clinica/signos-vitales.service';
import { SignosVitales, NIVELES_DOLOR } from '../../../../../core/models/clinica/signos-vitales.model';
import { SignosVitalesDialogComponent, SignosVitalesDialogData } from '../../signos-vitales-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../../../shared/directives/permiso.directive';


@Component({
    selector: 'app-signos-vitales-tab',
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
    templateUrl: './signos-vitales-tab.component.html',
    styleUrl: './signos-vitales-tab.component.scss'
})
export class SignosVitalesTabComponent implements OnInit {
    @Input({ required: true }) idConsulta!: number;
    @Input({ required: true }) esCerrada: boolean = false;

    // Definimos el output para notificar el conteo al padre
    onCountChange = output<number>();

    signosVitales = signal<SignosVitales[]>([]);
    nivelesDolorOpts = NIVELES_DOLOR;

    constructor(
        private signosService: SignosVitalesService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.cargarSignosVitales();
    }

  cargarSignosVitales(): void {
    this.signosService.obtenerPorConsulta(this.idConsulta).subscribe({
      next: (data: SignosVitales[]) => {
        this.signosVitales.set(data);
        // 3. Emitimos la longitud del arreglo al componente padre
        this.onCountChange.emit(data.length);
      },
      error: () => this.mostrarError('Error al cargar signos vitales.')
    });
  }

    abrirFormSignos(): void {
        const dialogRef = this.dialog.open(SignosVitalesDialogComponent, {
            width: '640px',
            maxWidth: '95vw',
            disableClose: true,
            data: { idConsulta: this.idConsulta } as SignosVitalesDialogData
        });
        dialogRef.afterClosed().subscribe((guardado: any) => {
            if (guardado) this.cargarSignosVitales();
        });
    }

    editarSignos(signos: SignosVitales): void {
        const dialogRef = this.dialog.open(SignosVitalesDialogComponent, {
            width: '640px',
            maxWidth: '95vw',
            disableClose: true,
            data: { idConsulta: this.idConsulta, signos } as SignosVitalesDialogData
        });
        dialogRef.afterClosed().subscribe((guardado: any) => {
            if (guardado) this.cargarSignosVitales();
        });
    }

    confirmarEliminarSignos(signos: SignosVitales): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Signos Vitales',
                mensaje: '¿Eliminar este registro de signos vitales?',
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe((confirmado: boolean) => {
            if (confirmado) this.eliminarSignos(signos.idSignos);
        });
    }

    eliminarSignos(idSignos: number): void {
        this.signosService.eliminar(this.idConsulta, idSignos).subscribe({
            next: () => {
                this.mostrarExito('Signos vitales eliminados.');
                this.cargarSignosVitales();
            },
            error: (err: any) => this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar.')
        });
    }

    // ── Helpers de Cálculo Estilos / Métricas ──────────────────────────────────
    calcularImc(peso: number | null, altura: number | null): string {
        if (!peso || !altura || altura === 0) return '—';
        return (peso / (altura * altura)).toFixed(2);
    }

    colorImc(peso: number | null, altura: number | null): string {
        if (!peso || !altura || altura === 0) return '#777';
        const imc = peso / (altura * altura);
        if (imc < 18.5) return '#2196f3';
        if (imc < 25) return '#4caf50';
        if (imc < 30) return '#ff9800';
        return '#f44336';
    }

    colorSaturacion(valor: number | null): string {
        if (!valor) return '#777';
        if (valor >= 95) return '#4caf50';
        if (valor >= 90) return '#ff9800';
        return '#f44336';
    }

    colorPresion(sistolica: number | null): string {
        if (!sistolica) return '#777';
        if (sistolica < 120) return '#4caf50';
        if (sistolica < 140) return '#ff9800';
        return '#f44336';
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}