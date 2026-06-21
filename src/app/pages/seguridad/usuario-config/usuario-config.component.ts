import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { UsuarioService } from '../../../core/services/seguridad/usuario.service';
import {
    ConfiguracionUsuario,
    MenuUsuarioConfig,
    PermisoUsuarioConfig,
    GuardarPermisoUsuario,
    GuardarConfiguracionUsuario
} from '../../../core/models/seguridad/usuario-config.model';

@Component({
    selector: 'app-usuario-config',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatDividerModule,
        MatChipsModule
    ],
    templateUrl: './usuario-config.component.html',
    styleUrl: './usuario-config.component.scss'
})
export class UsuarioConfigComponent implements OnInit {

    idUsuario = signal<number>(0);
    config = signal<ConfiguracionUsuario | null>(null);
    cargando = signal(true);
    guardando = signal(false);

    modulosExpandidos = signal<Set<number>>(new Set());
    menusExpandidos = signal<Set<number>>(new Set());

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private usuarioService: UsuarioService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.idUsuario.set(id);
        this.cargarConfiguracion();
    }

    cargarConfiguracion(): void {
        this.cargando.set(true);
        this.usuarioService.obtenerConfiguracion(this.idUsuario()).subscribe({
            next: (data) => {
                setTimeout(() => {
                    this.config.set(data);
                    // Por defecto todo arranca colapsado
                    this.modulosExpandidos.set(new Set());
                    this.menusExpandidos.set(new Set());
                    this.cargando.set(false);
                }, 300);
            },
            error: () => {
                setTimeout(() => {
                    this.mostrarError('Error al cargar configuración.');
                    this.cargando.set(false);
                }, 300);
            }
        });
    }

    toggleModulo(idModulo: number): void {
        this.modulosExpandidos.update(set => {
            const nuevo = new Set(set);
            if (nuevo.has(idModulo)) {
                nuevo.delete(idModulo);
            } else {
                nuevo.add(idModulo);
            }
            return nuevo;
        });
    }

    moduloExpandido(idModulo: number): boolean {
        return this.modulosExpandidos().has(idModulo);
    }

    toggleMenu(idMenu: number): void {
        this.menusExpandidos.update(set => {
            const nuevo = new Set(set);
            if (nuevo.has(idMenu)) {
                nuevo.delete(idMenu);
            } else {
                nuevo.add(idMenu);
            }
            return nuevo;
        });
    }

    menuExpandido(idMenu: number): boolean {
        return this.menusExpandidos().has(idMenu);
    }

    // Estado visual del permiso
    obtenerEstado(permiso: PermisoUsuarioConfig): 'heredado' | 'extra' | 'bloqueado' | 'sin-acceso' {
        if (permiso.concedido === true) return 'extra';
        if (permiso.concedido === false) return 'bloqueado';
        if (permiso.estadoRol) return 'heredado';
        return 'sin-acceso';
    }

    // Ciclo de estados al hacer clic
    togglePermiso(permiso: PermisoUsuarioConfig): void {
        const estado = this.obtenerEstado(permiso);

        if (estado === 'heredado') {
            permiso.concedido = false;
        } else if (estado === 'bloqueado') {
            permiso.concedido = null;
        } else if (estado === 'sin-acceso') {
            permiso.concedido = true;
        } else if (estado === 'extra') {
            permiso.concedido = null;
        }
    }

    obtenerTodosMenus(): MenuUsuarioConfig[] {
        const menus: MenuUsuarioConfig[] = [];
        const agregarMenus = (lista: MenuUsuarioConfig[]) => {
            lista.forEach(m => {
                menus.push(m);
                if (m.hijos?.length) agregarMenus(m.hijos);
            });
        };
        this.config()?.modulos.forEach(mod => agregarMenus(mod.menus));
        return menus;
    }

    guardar(): void {
        this.guardando.set(true);

        const todosMenus = this.obtenerTodosMenus();

        const permisos: GuardarPermisoUsuario[] = [];

        todosMenus.forEach(menu => {
            menu.permisos
                .filter(p => p.concedido !== null)
                .forEach(p => permisos.push({
                    idPermiso: p.idPermiso,
                    concedido: p.concedido!
                }));
        });

        const dto: GuardarConfiguracionUsuario = { permisos };

        this.usuarioService.guardarConfiguracion(this.idUsuario(), dto).subscribe({
            next: () => {
                this.mostrarExito('Configuración guardada exitosamente.');
                this.guardando.set(false);
            },
            error: () => {
                this.mostrarError('Error al guardar configuración.');
                this.guardando.set(false);
            }
        });
    }

    limpiarOverrides(): void {
        this.usuarioService.eliminarTodosOverrides(this.idUsuario()).subscribe({
            next: () => {
                this.mostrarExito('Overrides eliminados. El usuario hereda todo del rol.');
                this.cargarConfiguracion();
            },
            error: () => this.mostrarError('Error al limpiar overrides.')
        });
    }

    volver(): void {
        this.router.navigate(['/seguridad/usuarios']);
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}