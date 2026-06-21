import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Consulta, CrearConsulta, ActualizarConsulta } from '../../models/clinica/consulta.model';

@Injectable({ providedIn: 'root' })
export class ConsultaService {

    private readonly URL = `${environment.apiUrl}/consultas`;

    constructor(private http: HttpClient) {}

    obtenerPorPaciente(idPaciente: number): Observable<Consulta[]> {
        return this.http.get<Consulta[]>(`${this.URL}/paciente/${idPaciente}`);
    }

    obtenerPorId(id: number): Observable<Consulta> {
        return this.http.get<Consulta>(`${this.URL}/${id}`);
    }

    obtenerPorCita(idCita: number): Observable<Consulta> {
        return this.http.get<Consulta>(`${this.URL}/cita/${idCita}`);
    }

    crear(dto: CrearConsulta): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    actualizar(id: number, dto: ActualizarConsulta): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }
    obtenerTodos(): Observable<Consulta[]> {
        return this.http.get<Consulta[]>(this.URL);
    }
}