import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Rol, CrearRol, ActualizarRol } from '../../models/seguridad/rol.model';
import { ConfiguracionRol, GuardarConfiguracionRol } from '../../models/seguridad/rol-config.model';

@Injectable({ providedIn: 'root' })
export class RolService {

    private readonly URL = `${environment.apiUrl}/roles`;

    constructor(private http: HttpClient) {}

    crear(dto: CrearRol): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    obtenerTodos(): Observable<Rol[]> {
        return this.http.get<Rol[]>(this.URL);
    }

    obtenerPorId(id: number): Observable<Rol> {
        return this.http.get<Rol>(`${this.URL}/${id}`);
    }

    actualizar(id: number, dto: ActualizarRol): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }

    desactivar(id: number): Observable<any> {
        return this.http.patch(`${this.URL}/${id}/desactivar`, {});
    }

    // Configuración
    obtenerConfiguracion(idRol: number): Observable<ConfiguracionRol> {
        return this.http.get<ConfiguracionRol>(`${this.URL}/${idRol}/configuracion`);
    }

    guardarConfiguracion(idRol: number, dto: GuardarConfiguracionRol): Observable<any> {
        return this.http.put(`${this.URL}/${idRol}/configuracion`, dto);
    }
}