import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { RolService } from '../../../core/services/seguridad/rol.service';
import {
    ConfiguracionRol,
    MenuConfig,
    GuardarMenuConfig,
    GuardarConfiguracionRol
} from '../../../core/models/seguridad/rol-config.model';

@Component({
    selector: 'app-rol-config',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatDividerModule
    ],
    templateUrl: './rol-config.component.html',
    styleUrl: './rol-config.component.scss'
})
export class RolConfigComponent implements OnInit {

    idRol = signal<number>(0);
    config = signal<ConfiguracionRol | null>(null);
    cargando = signal(true);
    guardando = signal(false);

    modulosExpandidos = signal<Set<number>>(new Set());
    menusExpandidos = signal<Set<number>>(new Set());

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private rolService: RolService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.idRol.set(id);
        this.cargarConfiguracion();
    }

    // cargarConfiguracion(): void {
    //     this.cargando.set(true);
    //     this.rolService.obtenerConfiguracion(this.idRol()).subscribe({
    //         next: (data) => {
    //             this.config.set(data);
    //             // Por defecto todo arranca expandido
    //             this.modulosExpandidos.set(new Set(data.modulos.map(m => m.idModulo)));
    //             this.menusExpandidos.set(new Set(this.obtenerTodosMenus().map(m => m.idMenu)));
    //             this.cargando.set(false);
    //         },
    //         error: () => {
    //             this.mostrarError('Error al cargar configuración.');
    //             this.cargando.set(false);
    //         }
    //     });
    // }
    cargarConfiguracion(): void {
        this.cargando.set(true);
        this.rolService.obtenerConfiguracion(this.idRol()).subscribe({
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

    toggleVisibleSidebar(menu: MenuConfig): void {
        menu.visibleSidebar = !menu.visibleSidebar;
    }

    togglePermiso(menu: MenuConfig, idPermiso: number): void {
        const permiso = menu.permisos.find(p => p.idPermiso === idPermiso);
        if (permiso) permiso.asignado = !permiso.asignado;
    }

    toggleTodosPermisos(menu: MenuConfig): void {
        const todosAsignados = menu.permisos.every(p => p.asignado);
        menu.permisos.forEach(p => p.asignado = !todosAsignados);
    }

    todosAsignados(menu: MenuConfig): boolean {
        return menu.permisos.length > 0 && menu.permisos.every(p => p.asignado);
    }

    algunoAsignado(menu: MenuConfig): boolean {
        return menu.permisos.some(p => p.asignado) && !this.todosAsignados(menu);
    }

    obtenerTodosMenus(): MenuConfig[] {
        const menus: MenuConfig[] = [];
        const agregarMenus = (lista: MenuConfig[]) => {
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

        const dto: GuardarConfiguracionRol = {
            menus: todosMenus.map(menu => ({
                idMenu: menu.idMenu,
                visibleSidebar: menu.visibleSidebar,
                idsPermisos: menu.permisos
                    .filter(p => p.asignado)
                    .map(p => p.idPermiso)
            } as GuardarMenuConfig))
        };

        this.rolService.guardarConfiguracion(this.idRol(), dto).subscribe({
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

    volver(): void {
        this.router.navigate(['/seguridad/roles']);
    }

    private mostrarExito(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
    }

    private mostrarError(mensaje: string): void {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
    }
}