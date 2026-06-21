import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth/auth.service';
import { DashboardService } from '../../core/services/seguridad/dashboard.service';
import { Perfil } from '../../core/models/auth/perfil.model';
import { DashboardMetricas } from '../../core/models/seguridad/dashboard.model';

// dashboard.component.ts — agregar import
import { AgendaMedicoComponent }
    from './agenda-medico/agenda-medico.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        AgendaMedicoComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    perfil    = signal<Perfil | null>(null);
    metricas  = signal<DashboardMetricas | null>(null);
    fechaActual = signal(new Date());
    cargandoMetricas = signal(false);

    constructor(
        public authService: AuthService,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.cargarPerfil();
        this.cargarMetricas();
    }

    cargarPerfil(): void {
        this.authService.obtenerPerfil().subscribe({
            next: (data) => this.perfil.set(data)
        });
    }

    cargarMetricas(): void {
        if (!this.authService.tienePermiso('dashboard.metricas')) return;

        this.cargandoMetricas.set(true);
        this.dashboardService.obtenerMetricas().subscribe({
            next: (data) => {
                this.metricas.set(data);
                this.cargandoMetricas.set(false);
            },
            error: () => this.cargandoMetricas.set(false)
        });
    }

    obtenerSaludo(): string {
        const hora = new Date().getHours();
        if (hora < 12) return 'Buenos días';
        if (hora < 18) return 'Buenas tardes';
        return 'Buenas noches';
    }
}