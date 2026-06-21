import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Especialidad, CrearEspecialidad, ActualizarEspecialidad } from '../../models/clinica/especialidad.model';

@Injectable({ providedIn: 'root' })
export class EspecialidadService {

    private readonly URL = `${environment.apiUrl}/especialidades`;

    constructor(private http: HttpClient) {}

    obtenerTodos(): Observable<Especialidad[]> {
        return this.http.get<Especialidad[]>(this.URL);
    }

    obtenerActivos(): Observable<Especialidad[]> {
        return this.http.get<Especialidad[]>(`${this.URL}/activos`);
    }

    obtenerPorId(id: number): Observable<Especialidad> {
        return this.http.get<Especialidad>(`${this.URL}/${id}`);
    }

    crear(dto: CrearEspecialidad): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    actualizar(id: number, dto: ActualizarEspecialidad): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }
}