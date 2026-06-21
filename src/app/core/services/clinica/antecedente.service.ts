import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Antecedente, CrearAntecedente, ActualizarAntecedente } from '../../models/clinica/antecedente.model';

@Injectable({ providedIn: 'root' })
export class AntecedenteService {

    private readonly URL = `${environment.apiUrl}/pacientes`;

    constructor(private http: HttpClient) {}

    obtenerPorPaciente(idPaciente: number): Observable<Antecedente[]> {
        return this.http.get<Antecedente[]>(`${this.URL}/${idPaciente}/antecedentes`);
    }

    obtenerPorTipo(idPaciente: number, tipo: string): Observable<Antecedente[]> {
        return this.http.get<Antecedente[]>(`${this.URL}/${idPaciente}/antecedentes/tipo/${tipo}`);
    }

    crear(idPaciente: number, dto: CrearAntecedente): Observable<any> {
        return this.http.post(`${this.URL}/${idPaciente}/antecedentes`, dto);
    }

    actualizar(idPaciente: number, idAntecedente: number, dto: ActualizarAntecedente): Observable<any> {
        return this.http.put(`${this.URL}/${idPaciente}/antecedentes/${idAntecedente}`, dto);
    }

    eliminar(idPaciente: number, idAntecedente: number): Observable<any> {
        return this.http.delete(`${this.URL}/${idPaciente}/antecedentes/${idAntecedente}`);
    }
}