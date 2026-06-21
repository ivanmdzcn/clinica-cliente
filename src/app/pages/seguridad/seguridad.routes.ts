import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso.guard'; // Verifica que los niveles de relativo (../) sean correctos

export const seguridadRoutes: Routes = [
    {
        path: 'modulos',
        loadComponent: () => import('./modulos/modulos.component')
            .then(m => m.ModulosComponent),
        canActivate: [permisoGuard('modulos.leer')]
    },
    {
        path: 'menus',
        loadComponent: () => import('./menus/menus.component')
            .then(m => m.MenusComponent),
        canActivate: [permisoGuard('menus.leer')]
    },
    {
        path: 'permisos',
        loadComponent: () => import('./permisos/permisos.component')
            .then(m => m.PermisosComponent),
        canActivate: [permisoGuard('permisos.leer')]
    },
    {
        path: 'roles',
        loadComponent: () => import('./roles/roles.component')
            .then(m => m.RolesComponent),
        canActivate: [permisoGuard('roles.leer')]
    },
    {
        path: 'usuarios',
        loadComponent: () => import('./usuarios/usuarios.component')
            .then(m => m.UsuariosComponent),
        canActivate: [permisoGuard('usuarios.leer')]
    },
    {
        path: 'roles/:id/configuracion',
        loadComponent: () => import('./rol-config/rol-config.component')
            .then(m => m.RolConfigComponent),
        canActivate: [permisoGuard('rolpermisos.actualizar')]
    },
    {
        path: 'usuarios/:id/configuracion',
        loadComponent: () => import('./usuario-config/usuario-config.component')
            .then(m => m.UsuarioConfigComponent),
        canActivate: [permisoGuard('usuariopermisos.actualizar')]
    }
];