import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CatalogoExamen, CatalogoExamenBusqueda, CrearCatalogoExamen }
    from '../../models/clinica/catalogo-examen.model';

@Injectable({ providedIn: 'root' })
export class CatalogoExamenService {

    private readonly URL = `${environment.apiUrl}/catalogo-examenes`;

    constructor(private http: HttpClient) {}

    obtenerTodos(): Observable<CatalogoExamen[]> {
        return this.http.get<CatalogoExamen[]>(this.URL);
    }

    buscar(termino: string): Observable<CatalogoExamenBusqueda[]> {
        return this.http.get<CatalogoExamenBusqueda[]>(`${this.URL}/buscar`, {
            params: { termino }
        });
    }

    obtenerPorId(id: number): Observable<CatalogoExamen> {
        return this.http.get<CatalogoExamen>(`${this.URL}/${id}`);
    }

    crear(dto: CrearCatalogoExamen): Observable<any> {
        return this.http.post(this.URL, dto);
    }
}