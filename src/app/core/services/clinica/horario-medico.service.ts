import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HorarioMedico, CrearHorarioMedico, ActualizarHorarioMedico } from '../../models/clinica/horario-medico.model';
import { SlotDisponible } from '../../models/clinica/cita.model'; // 👈 importar desde cita.model

@Injectable({ providedIn: 'root' })
export class HorarioMedicoService {

    private readonly URL = `${environment.apiUrl}/medicos`;

    constructor(private http: HttpClient) {}

    obtenerPorMedico(idMedico: number): Observable<HorarioMedico[]> {
        return this.http.get<HorarioMedico[]>(`${this.URL}/${idMedico}/horarios`);
    }

    obtenerSlots(idMedico: number, fecha: string): Observable<SlotDisponible[]> {
        return this.http.get<SlotDisponible[]>(
            `${this.URL}/${idMedico}/horarios/slots?fecha=${fecha}`
        );
    }

    crear(idMedico: number, dto: CrearHorarioMedico): Observable<any> {
        return this.http.post(`${this.URL}/${idMedico}/horarios`, dto);
    }

    actualizar(idMedico: number, idHorario: number, dto: ActualizarHorarioMedico): Observable<any> {
        return this.http.put(`${this.URL}/${idMedico}/horarios/${idHorario}`, dto);
    }

    eliminar(idMedico: number, idHorario: number): Observable<any> {
        return this.http.delete(`${this.URL}/${idMedico}/horarios/${idHorario}`);
    }
}