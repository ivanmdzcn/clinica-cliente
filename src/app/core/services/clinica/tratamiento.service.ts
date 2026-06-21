import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Tratamiento, CrearTratamiento, ActualizarTratamiento }
    from '../../models/clinica/tratamiento.model';

@Injectable({ providedIn: 'root' })
export class TratamientoService {

    private readonly URL = `${environment.apiUrl}/consultas`;

    constructor(private http: HttpClient) {}

    obtenerPorConsulta(idConsulta: number): Observable<Tratamiento[]> {
        return this.http.get<Tratamiento[]>(
            `${this.URL}/${idConsulta}/tratamientos`
        );
    }

    crear(idConsulta: number, dto: CrearTratamiento): Observable<any> {
        return this.http.post(
            `${this.URL}/${idConsulta}/tratamientos`, dto
        );
    }

    actualizar(idConsulta: number, idTratamiento: number, dto: ActualizarTratamiento): Observable<any> {
        return this.http.put(
            `${this.URL}/${idConsulta}/tratamientos/${idTratamiento}`, dto
        );
    }

    eliminar(idConsulta: number, idTratamiento: number): Observable<any> {
        return this.http.delete(
            `${this.URL}/${idConsulta}/tratamientos/${idTratamiento}`
        );
    }
}