import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Medico, CrearMedico, ActualizarMedico } from '../../models/clinica/medico.model';

@Injectable({ providedIn: 'root' })
export class MedicoService {

    private readonly URL = `${environment.apiUrl}/medicos`;

    constructor(private http: HttpClient) { }

    obtenerTodos(): Observable<Medico[]> {
        return this.http.get<Medico[]>(this.URL);
    }

    obtenerActivos(): Observable<Medico[]> {
        return this.http.get<Medico[]>(`${this.URL}/activos`);
    }

    obtenerPorId(id: number): Observable<Medico> {
        return this.http.get<Medico>(`${this.URL}/${id}`);
    }

    crear(dto: CrearMedico): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    actualizar(id: number, dto: ActualizarMedico): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }

    obtenerMiIdMedico(): Observable<{ idMedico: number }> {
        return this.http.get<{ idMedico: number }>(`${this.URL}/mi-id`);
    }
}