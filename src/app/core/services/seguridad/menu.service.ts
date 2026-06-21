import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Menu, CrearMenu, ActualizarMenu, MenuArbolAdmin } from '../../models/seguridad/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {

    private readonly URL = `${environment.apiUrl}/menus`;

    constructor(private http: HttpClient) {}

    crear(dto: CrearMenu): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    obtenerTodos(): Observable<Menu[]> {
        return this.http.get<Menu[]>(this.URL);
    }

    obtenerPorId(id: number): Observable<Menu> {
        return this.http.get<Menu>(`${this.URL}/${id}`);
    }

    obtenerArbol(): Observable<MenuArbolAdmin[]> {
        return this.http.get<MenuArbolAdmin[]>(`${this.URL}/arbol`);
    }

    actualizar(id: number, dto: ActualizarMenu): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }

    desactivar(id: number): Observable<any> {
        return this.http.patch(`${this.URL}/${id}/desactivar`, {});
    }
}