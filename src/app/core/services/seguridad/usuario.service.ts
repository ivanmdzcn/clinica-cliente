import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Usuario, CrearUsuario, ActualizarUsuario } from '../../models/seguridad/usuario.model';
import { ConfiguracionUsuario, GuardarConfiguracionUsuario } from '../../models/seguridad/usuario-config.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

    private readonly URL = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) {}

    crear(dto: CrearUsuario): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    obtenerTodos(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.URL);
    }

    obtenerPorId(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.URL}/${id}`);
    }

    actualizar(id: number, dto: ActualizarUsuario): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }

    desactivar(id: number): Observable<any> {
        return this.http.patch(`${this.URL}/${id}/desactivar`, {});
    }

    // Configuración
    obtenerConfiguracion(idUsuario: number): Observable<ConfiguracionUsuario> {
        return this.http.get<ConfiguracionUsuario>(`${this.URL}/${idUsuario}/configuracion`);
    }

    guardarConfiguracion(idUsuario: number, dto: GuardarConfiguracionUsuario): Observable<any> {
        return this.http.put(`${this.URL}/${idUsuario}/configuracion`, dto);
    }

    eliminarOverride(idUsuario: number, idPermiso: number): Observable<any> {
        return this.http.delete(`${this.URL}/${idUsuario}/configuracion/permisos/${idPermiso}`);
    }

    eliminarTodosOverrides(idUsuario: number): Observable<any> {
        return this.http.delete(`${this.URL}/${idUsuario}/configuracion/permisos`);
    }
}