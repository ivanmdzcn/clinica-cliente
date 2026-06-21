import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    OrdenLaboratorio, CrearOrdenLaboratorio,
    CambiarEstadoOrden, GuardarResultado, HistorialOrdenLab
} from '../../models/clinica/orden-laboratorio.model';

@Injectable({ providedIn: 'root' })
export class OrdenLaboratorioService {

    private readonly URL = `${environment.apiUrl}/ordenes-laboratorio`;

    constructor(private http: HttpClient) {}

    obtenerPorConsulta(idConsulta: number): Observable<OrdenLaboratorio[]> {
        return this.http.get<OrdenLaboratorio[]>(`${this.URL}/consulta/${idConsulta}`);
    }

    obtenerPorPaciente(idPaciente: number): Observable<OrdenLaboratorio[]> {
        return this.http.get<OrdenLaboratorio[]>(`${this.URL}/paciente/${idPaciente}`);
    }

    obtenerPorEstado(estado: string): Observable<OrdenLaboratorio[]> {
        return this.http.get<OrdenLaboratorio[]>(`${this.URL}/estado/${estado}`);
    }

    obtenerTodos(): Observable<OrdenLaboratorio[]> {
        return this.http.get<OrdenLaboratorio[]>(`${this.URL}/estado/pendiente`);
    }

    obtenerPorId(id: number): Observable<OrdenLaboratorio> {
        return this.http.get<OrdenLaboratorio>(`${this.URL}/${id}`);
    }

    obtenerHistorial(id: number): Observable<HistorialOrdenLab[]> {
        return this.http.get<HistorialOrdenLab[]>(`${this.URL}/${id}/historial`);
    }

    crear(dto: CrearOrdenLaboratorio): Observable<any> {
        return this.http.post(this.URL, dto);
    }

    cambiarEstado(id: number, dto: CambiarEstadoOrden): Observable<any> {
        return this.http.patch(`${this.URL}/${id}/estado`, dto);
    }

    guardarResultados(idDetalle: number, resultados: GuardarResultado[]): Observable<any> {
        return this.http.post(`${this.URL}/detalle/${idDetalle}/resultados`, resultados);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.URL}/${id}`);
    }
}