import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ConfiguracionEmpresa, GuardarConfiguracionEmpresa } from '../../models/seguridad/empresa.model';
//                                                                 ../../models/seguridad/empresa.model

@Injectable({ providedIn: 'root' })
export class EmpresaService {

    private readonly URL = `${environment.apiUrl}/configuracion/empresa`;

    constructor(private http: HttpClient) {}

        // 👇 Endpoint público — sin permiso requerido
    obtenerPublica(): Observable<any> {
        return this.http.get(`${this.URL}/publica`);
    }

        // 👇 Endpoint completo — requiere empresa.leer
    obtener(): Observable<ConfiguracionEmpresa> {
        return this.http.get<ConfiguracionEmpresa>(this.URL);
    }

    guardar(dto: GuardarConfiguracionEmpresa): Observable<any> {
        return this.http.put(this.URL, dto);
    }
}