import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login.component')
            .then(m => m.LoginComponent)
    },
    {
        path: '',
        loadComponent: () => import('./layout/main-layout/main-layout.component')
            .then(m => m.MainLayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component')
                    .then(m => m.DashboardComponent)
            },
            {
                path: 'perfil',
                loadComponent: () => import('./pages/perfil/perfil.component')
                    .then(m => m.PerfilComponent)
            },
            // {
            //     path: 'cambiar-contrasena',
            //     loadComponent: () => import('./pages/cambiar-contrasena/cambiar-contrasena.component')
            //         .then(m => m.CambiarContrasenaComponent)
            // },
            {
                path: 'configuracion/empresa',
                loadComponent: () => import('./pages/empresa/empresa.component')
                    .then(m => m.EmpresaComponent),
                // Asumiendo que permisoGuard se puede manejar internamente o se mantiene aquí si es general
            },
            // DELEGACIÓN MODULAR (Lazy Loading de Grupos de Rutas)
            {
                path: 'seguridad',
                loadChildren: () => import('./pages/seguridad/seguridad.routes')
                    .then(m => m.seguridadRoutes)
            },
            {
                path: 'clinica',
                loadChildren: () => import('./pages/clinica/clinica.routes')
                    .then(m => m.clinicaRoutes)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'sin-acceso',
        loadComponent: () => import('./pages/sin-acceso/sin-acceso.component')
            .then(m => m.SinAccesoComponent)
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];