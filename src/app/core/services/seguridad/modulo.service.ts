import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Modulo, CrearModulo, ActualizarModulo } from '../../models/seguridad/modulo.model';

@Injectable({ providedIn: 'root' })
export class ModuloService {

    private readonly URL = `${environment.apiUrl}/modulos`;

    constructor(private http: HttpClient) {}

    crear(dto: CrearModulo): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    obtenerTodos(): Observable<Modulo[]> {
        return this.http.get<Modulo[]>(this.URL);
    }

    obtenerPorId(id: number): Observable<Modulo> {
        return this.http.get<Modulo>(`${this.URL}/${id}`);
    }

    actualizar(id: number, dto: ActualizarModulo): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }

    desactivar(id: number): Observable<any> {
        return this.http.patch(`${this.URL}/${id}/desactivar`, {});
    }
}