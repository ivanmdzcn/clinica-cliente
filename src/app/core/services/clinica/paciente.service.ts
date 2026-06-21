import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Paciente, CrearPaciente, ActualizarPaciente } from '../../models/clinica/paciente.model';

@Injectable({ providedIn: 'root' })
export class PacienteService {

    private readonly URL = `${environment.apiUrl}/pacientes`;

    constructor(private http: HttpClient) {}

    crear(dto: CrearPaciente): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    obtenerTodos(): Observable<Paciente[]> {
        return this.http.get<Paciente[]>(this.URL);
    }

    obtenerPorId(id: number): Observable<Paciente> {
        return this.http.get<Paciente>(`${this.URL}/${id}`);
    }

    actualizar(id: number, dto: ActualizarPaciente): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }

    desactivar(id: number): Observable<any> {
        return this.http.patch(`${this.URL}/${id}/desactivar`, {});
    }
}