import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Login } from '../../models/auth/login.model';
import { Token } from '../../models/auth/token.model';
import { Perfil } from '../../models/auth/perfil.model';
import { ModuloMenu } from '../../models/auth/sidebar.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private readonly URL = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'token';

    // Signals — estado reactivo
    private _token = signal<Token | null>(this.cargarToken());
    
    // Computed — derivados del token
    readonly usuario   = computed(() => this._token()?.nombre ?? '');
    readonly idUsuario = computed(() => this._token()?.idUsuario ?? 0);
    readonly idRol     = computed(() => this._token()?.idRol ?? 0);
    readonly permisos  = computed(() => this._token()?.permisos ?? []);
    readonly estaAutenticado = computed(() => !!this._token());

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    login(dto: Login): Observable<Token> {
        return this.http.post<Token>(`${this.URL}/login`, dto).pipe(
            tap(token => {
                localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
                this._token.set(token);
            })
        );
    }

    logout(): Observable<any> {
        return this.http.post(`${this.URL}/logout`, {}).pipe(
            tap(() => this.limpiarSesion())
        );
    }

    obtenerPerfil(): Observable<Perfil> {
        return this.http.get<Perfil>(`${this.URL}/perfil`);
    }

    obtenerSidebar(): Observable<ModuloMenu[]> {
        return this.http.get<ModuloMenu[]>(`${this.URL}/sidebar`);
    }

    cambiarContrasena(dto: { contrasenaActual: string; contrasenaNueva: string; confirmarContrasena: string }): Observable<any> {
        return this.http.put(`${this.URL}/cambiar-contrasena`, dto);
    }

    obtenerToken(): string | null {
        return this._token()?.token ?? null;
    }

    tienePermiso(permiso: string): boolean {
        return this.permisos().includes(permiso);
    }

    tieneAlgunPermiso(permisos: string[]): boolean {
        return permisos.some(p => this.permisos().includes(p));
    }

    private cargarToken(): Token | null {
        const data = localStorage.getItem(this.TOKEN_KEY);
        if (!data) return null;

        try {
            const token: Token = JSON.parse(data);
            // Verificar si el token expiró
            if (new Date(token.expiracion) < new Date()) {
                localStorage.removeItem(this.TOKEN_KEY);
                return null;
            }
            return token;
        } catch {
            return null;
        }
    }

    private limpiarSesion(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this._token.set(null);
        this.router.navigate(['/login']);
    }
}