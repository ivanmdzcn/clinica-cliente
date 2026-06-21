import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Alergia, CrearAlergia, ActualizarAlergia } from '../../models/clinica/alergia.model';

@Injectable({ providedIn: 'root' })
export class AlergiaService {

    private readonly URL = `${environment.apiUrl}/pacientes`;

    constructor(private http: HttpClient) {}

    obtenerPorPaciente(idPaciente: number): Observable<Alergia[]> {
        return this.http.get<Alergia[]>(`${this.URL}/${idPaciente}/alergias`);
    }

    obtenerPorId(idPaciente: number, idAlergia: number): Observable<Alergia> {
        return this.http.get<Alergia>(`${this.URL}/${idPaciente}/alergias/${idAlergia}`);
    }

    crear(idPaciente: number, dto: CrearAlergia): Observable<any> {
        return this.http.post(`${this.URL}/${idPaciente}/alergias`, dto);
    }

    actualizar(idPaciente: number, idAlergia: number, dto: ActualizarAlergia): Observable<any> {
        return this.http.put(`${this.URL}/${idPaciente}/alergias/${idAlergia}`, dto);
    }

    eliminar(idPaciente: number, idAlergia: number): Observable<any> {
        return this.http.delete(`${this.URL}/${idPaciente}/alergias/${idAlergia}`);
    }
}