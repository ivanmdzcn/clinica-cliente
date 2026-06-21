import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    Cita, CitaHistorial, CrearCita,
    ActualizarCita, CambiarEstadoCita, SlotDisponible
} from '../../models/clinica/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {

    private readonly URL = `${environment.apiUrl}/citas`;

    constructor(private http: HttpClient) {}

    obtenerTodos(): Observable<Cita[]> {
        return this.http.get<Cita[]>(this.URL);
    }

    obtenerPorMedico(idMedico: number, fecha?: string): Observable<Cita[]> {
        let params = new HttpParams();
        if (fecha) params = params.set('fecha', fecha);
        return this.http.get<Cita[]>(`${this.URL}/medico/${idMedico}`, { params });
    }

    obtenerPorPaciente(idPaciente: number): Observable<Cita[]> {
        return this.http.get<Cita[]>(`${this.URL}/paciente/${idPaciente}`);
    }

    obtenerPorId(id: number): Observable<Cita> {
        return this.http.get<Cita>(`${this.URL}/${id}`);
    }

    obtenerHistorial(id: number): Observable<CitaHistorial[]> {
        return this.http.get<CitaHistorial[]>(`${this.URL}/${id}/historial`);
    }

    crear(dto: CrearCita): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    actualizar(id: number, dto: ActualizarCita): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    cambiarEstado(id: number, dto: CambiarEstadoCita): Observable<any> {
        return this.http.patch(`${this.URL}/${id}/estado`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }
}