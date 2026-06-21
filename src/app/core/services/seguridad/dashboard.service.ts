import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardMetricas } from '../../models/seguridad/dashboard.model';

// Agregar el import del modelo para dasboard de clinica
import { AgendaDia } from '../../models/clinica/agenda.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {

    private readonly URL = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    obtenerMetricas(): Observable<DashboardMetricas> {
        return this.http.get<DashboardMetricas>(`${this.URL}/metricas`);
    }

    // Agregar dentro de la clase existente
    obtenerAgendaDia(idMedico: number, fecha: string): Observable<AgendaDia> {
        return this.http.get<AgendaDia>(
            `${environment.apiUrl}/dashboard/clinica/medicos/${idMedico}/agenda-dia`,
            { params: { fecha } }
        );
    }
}