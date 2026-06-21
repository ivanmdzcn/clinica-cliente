import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Diagnostico, CrearDiagnostico, ActualizarDiagnostico }
    from '../../models/clinica/diagnostico.model';

@Injectable({ providedIn: 'root' })
export class DiagnosticoService {

    private readonly URL = `${environment.apiUrl}/consultas`;

    constructor(private http: HttpClient) {}

    obtenerPorConsulta(idConsulta: number): Observable<Diagnostico[]> {
        return this.http.get<Diagnostico[]>(
            `${this.URL}/${idConsulta}/diagnosticos`
        );
    }

    crear(idConsulta: number, dto: CrearDiagnostico): Observable<any> {
        return this.http.post(
            `${this.URL}/${idConsulta}/diagnosticos`, dto
        );
    }

    actualizar(idConsulta: number, idDiagnostico: number, dto: ActualizarDiagnostico): Observable<any> {
        return this.http.put(
            `${this.URL}/${idConsulta}/diagnosticos/${idDiagnostico}`, dto
        );
    }

    eliminar(idConsulta: number, idDiagnostico: number): Observable<any> {
        return this.http.delete(
            `${this.URL}/${idConsulta}/diagnosticos/${idDiagnostico}`
        );
    }
}