import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DashboardService } from '../../../core/services/seguridad/dashboard.service';
import { MedicoService } from '../../../core/services/clinica/medico.service';
import { AgendaDia, AgendaSlot, ESTADOS_CITA }
    from '../../../core/models/clinica/agenda.model';
import { Medico } from '../../../core/models/clinica/medico.model';

@Component({
    selector: 'app-agenda-medico',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTooltipModule,
        MatDividerModule,
        MatSnackBarModule
    ],
    templateUrl: './agenda-medico.component.html',
    styleUrl: './agenda-medico.component.scss'
})
export class AgendaMedicoComponent implements OnInit {

    medicos = signal<Medico[]>([]);
    medicoSeleccionado = signal<number | null>(null);
    agenda = signal<AgendaDia | null>(null);
    cargando = signal(false);
    fechaActual = signal<string>(this.hoy());
    estadosCita = ESTADOS_CITA;
    mostrarSelector = signal(true);
    sinMedicoAsociado = signal(false);

    constructor(
        private dashboardService: DashboardService,
        private medicoService: MedicoService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        if (this.authService.tienePermiso('dashboard.agenda.todos')) {
            this.mostrarSelector.set(true);
            this.cargarMedicos();
        } else {
            this.mostrarSelector.set(false);
            this.cargarMiMedico();
        }
    }

    // ── Carga para roles con permiso completo (recepción/admin) ────────────────
    cargarMedicos(): void {
        this.medicoService.obtenerTodos().subscribe({
            next: (data) => {
                this.medicos.set(data);
                if (data.length > 0) {
                    this.medicoSeleccionado.set(data[0].idMedico);
                    this.cargarAgenda();
                }
            },
            error: () => { }
        });
    }

    // ── Carga para el médico logueado (solo su propia agenda) ──────────────────
    cargarMiMedico(): void {
        this.medicoService.obtenerMiIdMedico().subscribe({
            next: (data) => {
                this.medicoSeleccionado.set(data.idMedico);
                this.cargarAgenda();
            },
            error: () => {
                this.sinMedicoAsociado.set(true);
                // Sin snackbar — simplemente se oculta el componente
            }
        });
    }

    cargarAgenda(): void {
        const idMedico = this.medicoSeleccionado();
        if (!idMedico) return;

        this.cargando.set(true);
        this.agenda.set(null);

        this.dashboardService.obtenerAgendaDia(idMedico, this.fechaActual()).subscribe({
            next: (data) => {
                this.agenda.set(data);
                this.cargando.set(false);
            },
            error: (err) => {
                const mensaje = err.status === 403
                    ? 'No tiene permiso para ver esta agenda.'
                    : 'Error al cargar agenda.';
                this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
                this.cargando.set(false);
            }
        });
    }

    onMedicoChange(): void {
        this.cargarAgenda();
    }

    diaAnterior(): void {
        const d = new Date(this.fechaActual() + 'T00:00:00');
        d.setDate(d.getDate() - 1);
        this.fechaActual.set(this.formatearFecha(d));
        this.cargarAgenda();
    }

    diaSiguiente(): void {
        const d = new Date(this.fechaActual() + 'T00:00:00');
        d.setDate(d.getDate() + 1);
        this.fechaActual.set(this.formatearFecha(d));
        this.cargarAgenda();
    }

    irHoy(): void {
        this.fechaActual.set(this.hoy());
        this.cargarAgenda();
    }

    get esHoy(): boolean {
        return this.fechaActual() === this.hoy();
    }

    verCita(slot: AgendaSlot): void {
        if (slot.idCita) {
            this.router.navigate(['/clinica/citas']);
        }
    }

    obtenerEstado(valor: string | null) {
        return this.estadosCita.find(e => e.value === valor);
    }

    private hoy(): string {
        return this.formatearFecha(new Date());
    }

    private formatearFecha(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    formatearFechaDisplay(fecha: string): string {
        const d = new Date(fecha + 'T00:00:00');
        return d.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}