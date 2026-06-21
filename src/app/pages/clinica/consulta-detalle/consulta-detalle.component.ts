import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConsultaService } from '../../../core/services/clinica/consulta.service';
import { Consulta, ActualizarConsulta, TIPOS_CONSULTA, ESTADOS_CONSULTA } from '../../../core/models/clinica/consulta.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PermisoDirective } from '../../../shared/directives/permiso.directive';
import { AuthService } from '../../../core/services/auth/auth.service';
import { EditarConsultaDialogComponent } from '../consultas/editar-consulta-dialog.component';

// Pestañas Hijas Distribuidas
import { SignosVitalesTabComponent } from './tabs/signos-vitales-tab/signos-vitales-tab.component';
import { DiagnosticosTabComponent } from './tabs/diagnosticos-tab/diagnosticos-tab.component';
import { TratamientosTabComponent } from './tabs/tratamientos-tab/tratamientos-tab.component';
import { LaboratorioTabComponent } from './tabs/laboratorio-tab/laboratorio-tab.component';
import { RecetasTabComponent } from './tabs/recetas-tab/recetas-tab.component';

@Component({
    selector: 'app-consulta-detalle',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatChipsModule,
        MatDividerModule,
        MatDialogModule,
        PermisoDirective,
        SignosVitalesTabComponent,
        DiagnosticosTabComponent,
        TratamientosTabComponent,
        LaboratorioTabComponent,
        RecetasTabComponent
    ],
    templateUrl: './consulta-detalle.component.html',
    styleUrl: './consulta-detalle.component.scss'
})
export class ConsultaDetalleComponent implements OnInit {

    idConsulta = signal<number>(0);

    // Contadores reactivos asíncronos vinculados a cada pestaña hija
    totalSignosVitales = signal<number>(0);
    totalDiagnosticos = signal<number>(0);
    totalTratamientos = signal<number>(0);
    totalOrdenesLab = signal<number>(0);
    totalRecetas = signal<number>(0);

    consulta = signal<Consulta | null>(null);
    cargando = signal(true);
    guardando = signal(false);

    tiposConsulta = TIPOS_CONSULTA;
    estadosConsulta = ESTADOS_CONSULTA;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private consultaService: ConsultaService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private authService: AuthService,
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.idConsulta.set(id);
        this.cargarConsulta();
    }

    cargarConsulta(): void {
        this.cargando.set(true);
        this.consultaService.obtenerPorId(this.idConsulta()).subscribe({
            next: (data: Consulta) => {
                this.consulta.set(data);
                this.cargando.set(false);
            },
            error: () => {
                this.mostrarError('Error al cargar la consulta.');
                this.cargando.set(false);
            }
        });
    }

    volver(): void {
        const c = this.consulta();
        if (c) {
            this.router.navigate(['/clinica/pacientes', c.idPaciente, 'history']);
        } else {
            this.router.navigate(['/clinica/pacientes']);
        }
    }

    // ── Editar — abre el mismo diálogo que usa el listado de consultas ─────────
    activarEdicion(): void {
        const c = this.consulta();
        if (!c) return;

        const dialogRef = this.dialog.open(EditarConsultaDialogComponent, {
            width: '680px',
            maxWidth: '95vw',
            data: { consulta: c },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((actualizado: boolean) => {
            if (actualizado) this.cargarConsulta();
        });
    }

    confirmarCerrar(): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
                titulo: 'Cerrar Consulta',
                mensaje: '¿Cerrar esta consulta? No podrá modificarse después.',
                btnConfirmar: 'Cerrar Consulta',
                color: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe((confirmado: boolean) => {
            if (confirmado) this.cerrarConsulta();
        });
    }

    cerrarConsulta(): void {
        this.guardando.set(true);
        const c = this.consulta();
        if (!c) return;

        const dto: ActualizarConsulta = {
            tipoConsulta: c.tipoConsulta,
            motivoConsulta: c.motivoConsulta,
            evolucionTratamiento: c.evolucionTratamiento,
            observaciones: c.observaciones,
            proximaCita: c.proximaCita,
            estado: 'cerrada'
        };

        this.consultaService.actualizar(this.idConsulta(), dto).subscribe({
            next: () => {
                this.guardando.set(false);
                this.mostrarExito('Consulta cerrada exitosamente.');
                this.cargarConsulta();
            },
            error: (err: any) => {
                this.mostrarError(err.error?.errores?.[0] ?? 'Error al cerrar consulta.');
                this.guardando.set(false);
            }
        });
    }

    obtenerEstado(valor: string) {
        return this.estadosConsulta.find(e => e.value === valor);
    }

    obtenerLabelTipo(valor: string | null): string {
        return this.tiposConsulta.find(t => t.value === valor)?.label ?? '—';
    }

    get esCerrada(): boolean {
        return this.consulta()?.estado === 'cerrada';
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}