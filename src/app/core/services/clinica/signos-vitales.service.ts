import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SignosVitales, CrearSignosVitales, ActualizarSignosVitales }
    from '../../models/clinica/signos-vitales.model';

@Injectable({ providedIn: 'root' })
export class SignosVitalesService {

    private readonly URL = `${environment.apiUrl}/consultas`;

    constructor(private http: HttpClient) {}

    obtenerPorConsulta(idConsulta: number): Observable<SignosVitales[]> {
        return this.http.get<SignosVitales[]>(`${this.URL}/${idConsulta}/signos-vitales`);
    }

    obtenerPorId(idConsulta: number, idSignos: number): Observable<SignosVitales> {
        return this.http.get<SignosVitales>(`${this.URL}/${idConsulta}/signos-vitales/${idSignos}`);
    }

    crear(idConsulta: number, dto: CrearSignosVitales): Observable<any> {
        return this.http.post(`${this.URL}/${idConsulta}/signos-vitales`, dto);
    }

    actualizar(idConsulta: number, idSignos: number, dto: ActualizarSignosVitales): Observable<any> {
        return this.http.put(`${this.URL}/${idConsulta}/signos-vitales/${idSignos}`, dto);
    }

    eliminar(idConsulta: number, idSignos: number): Observable<any> {
        return this.http.delete(`${this.URL}/${idConsulta}/signos-vitales/${idSignos}`);
    }
}