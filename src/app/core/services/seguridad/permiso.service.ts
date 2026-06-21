import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Permiso, CrearPermiso, ActualizarPermiso } from '../../models/seguridad/permiso.model';

@Injectable({ providedIn: 'root' })
export class PermisoService {

    private readonly URL = `${environment.apiUrl}/permisos`;

    constructor(private http: HttpClient) {}

    crear(dto: CrearPermiso): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    obtenerTodos(): Observable<Permiso[]> {
        return this.http.get<Permiso[]>(this.URL);
    }

    obtenerPorId(id: number): Observable<Permiso> {
        return this.http.get<Permiso>(`${this.URL}/${id}`);
    }

    actualizar(id: number, dto: ActualizarPermiso): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }
}