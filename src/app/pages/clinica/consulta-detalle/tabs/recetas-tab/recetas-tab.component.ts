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
import { RecetaService } from '../../../../../core/services/clinica/receta.service';
import { Receta } from '../../../../../core/models/clinica/receta.model';
import { RecetaDialogComponent, RecetaDialogData } from '../../receta-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../../../shared/directives/permiso.directive';

@Component({
    selector: 'app-recetas-tab',
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
    templateUrl: './recetas-tab.component.html',
    styleUrl: './recetas-tab.component.scss'
})
export class RecetasTabComponent implements OnInit {
    @Input({ required: true }) idConsulta!: number;
    @Input({ required: true }) esCerrada: boolean = false;
    @Input({ required: true }) idMedico!: number;
    @Input({ required: true }) idPaciente!: number;

    // Output reactivo para actualizar el numerito del tab en el padre
    onCountChange = output<number>();

    recetas = signal<Receta[]>([]);

    constructor(
        private recetaService: RecetaService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.cargarRecetas();
    }

    cargarRecetas(): void {
        this.recetaService.obtenerPorConsulta(this.idConsulta).subscribe({
            next: (data: Receta[]) => {
                this.recetas.set(data);
                this.onCountChange.emit(data.length);
            },
            error: () => this.mostrarError('Error al cargar recetas.')
        });
    }

    abrirFormReceta(): void {
        const dialogRef = this.dialog.open(RecetaDialogComponent, {
            width: '680px',
            maxWidth: '95vw',
            disableClose: true,
            data: { 
                idConsulta: this.idConsulta, 
                idMedico: this.idMedico, 
                idPaciente: this.idPaciente 
            } as RecetaDialogData
        });
        dialogRef.afterClosed().subscribe((guardado: any) => {
            if (guardado) this.cargarRecetas();
        });
    }

    confirmarEliminarReceta(receta: Receta): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Eliminar Receta',
                mensaje: `¿Eliminar esta receta médica?`,
                btnConfirmar: 'Eliminar',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe((confirmado: boolean) => {
            if (confirmado) this.eliminarReceta(receta.idReceta);
        });
    }

    eliminarReceta(idReceta: number): void {
        this.recetaService.eliminar(idReceta).subscribe({
            next: () => {
                this.mostrarExito('Receta eliminada.');
                this.cargarRecetas();
            },
            error: (err: any) => this.mostrarError(err.error?.errores?.[0] ?? 'Error al eliminar.')
        });
    }

    verReceta(idReceta: number): void {
        this.router.navigate(['/clinica/recetas', idReceta, 'vista']);
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}