import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cie10, Cie10Busqueda, CrearCie10 } from '../../models/clinica/cie10.model';

@Injectable({ providedIn: 'root' })
export class Cie10Service {

    private readonly URL = `${environment.apiUrl}/cie10`;

    constructor(private http: HttpClient) {}

    obtenerTodos(): Observable<Cie10[]> {
        return this.http.get<Cie10[]>(this.URL);
    }

    buscar(termino: string): Observable<Cie10Busqueda[]> {
        return this.http.get<Cie10Busqueda[]>(`${this.URL}/buscar`, {
            params: { termino }
        });
    }

    obtenerPorId(id: number): Observable<Cie10> {
        return this.http.get<Cie10>(`${this.URL}/${id}`);
    }

    obtenerPorCodigo(codigo: string): Observable<Cie10> {
        return this.http.get<Cie10>(`${this.URL}/codigo/${codigo}`);
    }

    crear(dto: CrearCie10): Observable<any> {
        return this.http.post(this.URL, dto);
    }
}