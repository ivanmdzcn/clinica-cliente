import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Medicamento, MedicamentoBusqueda, CrearMedicamento, ActualizarMedicamento }
    from '../../models/clinica/medicamento.model';

@Injectable({ providedIn: 'root' })
export class MedicamentoService {

    private readonly URL = `${environment.apiUrl}/medicamentos`;

    constructor(private http: HttpClient) {}

    obtenerTodos(): Observable<Medicamento[]> {
        return this.http.get<Medicamento[]>(this.URL);
    }

    buscar(termino: string): Observable<MedicamentoBusqueda[]> {
        return this.http.get<MedicamentoBusqueda[]>(`${this.URL}/buscar`, {
            params: { termino }
        });
    }

    obtenerPorId(id: number): Observable<Medicamento> {
        return this.http.get<Medicamento>(`${this.URL}/${id}`);
    }

    crear(dto: CrearMedicamento): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    actualizar(id: number, dto: ActualizarMedicamento): Observable<any> {
        return this.http.put(`${this.URL}/${id}`, dto);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }
}