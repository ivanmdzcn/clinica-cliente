import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Receta, CrearReceta } from '../../models/clinica/receta.model';

@Injectable({ providedIn: 'root' })
export class RecetaService {

    private readonly URL = `${environment.apiUrl}/recetas`;

    constructor(private http: HttpClient) {}

    obtenerPorConsulta(idConsulta: number): Observable<Receta[]> {
        return this.http.get<Receta[]>(`${this.URL}/consulta/${idConsulta}`);
    }

    obtenerPorPaciente(idPaciente: number): Observable<Receta[]> {
        return this.http.get<Receta[]>(`${this.URL}/paciente/${idPaciente}`);
    }

    obtenerPorId(id: number): Observable<Receta> {
        return this.http.get<Receta>(`${this.URL}/${id}`);
    }

    crear(dto: CrearReceta): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }
}