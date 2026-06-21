import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permisoGuard } from './core/guards/permiso.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login.component')
            //loadComponent: () => import('../app/pages/auth/login.component')
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
            // Seguridad
            {
                path: 'seguridad/modulos',
                loadComponent: () => import('./pages/seguridad/modulos/modulos.component')
                    .then(m => m.ModulosComponent),
                canActivate: [permisoGuard('modulos.leer')]
            },
            {
                path: 'seguridad/menus',
                loadComponent: () => import('./pages/seguridad/menus/menus.component')
                    .then(m => m.MenusComponent),
                canActivate: [permisoGuard('menus.leer')]
            },
            {
                path: 'seguridad/permisos',
                loadComponent: () => import('./pages/seguridad/permisos/permisos.component')
                    .then(m => m.PermisosComponent),
                canActivate: [permisoGuard('permisos.leer')]
            },
            {
                path: 'seguridad/roles',
                loadComponent: () => import('./pages/seguridad/roles/roles.component')
                    .then(m => m.RolesComponent),
                canActivate: [permisoGuard('roles.leer')]
            },
            {
                path: 'seguridad/usuarios',
                loadComponent: () => import('./pages/seguridad/usuarios/usuarios.component')
                    .then(m => m.UsuariosComponent),
                canActivate: [permisoGuard('usuarios.leer')]
            },
            {
                path: 'perfil',
                loadComponent: () => import('./pages/perfil/perfil.component')
                    .then(m => m.PerfilComponent)
            },
            {
                path: 'cambiar-contrasena',
                loadComponent: () => import('./pages/cambiar-contrasena/cambiar-contrasena.component')
                    .then(m => m.CambiarContrasenaComponent)
            },
            {
                path: 'configuracion/empresa',
                loadComponent: () => import('./pages/configuracion/empresa/empresa.component')
                    .then(m => m.EmpresaComponent),
                canActivate: [permisoGuard('empresa.leer')]
            },
            {
                path: 'seguridad/roles/:id/configuracion',
                loadComponent: () => import('./pages/seguridad/rol-config/rol-config.component')
                    .then(m => m.RolConfigComponent),
                canActivate: [permisoGuard('rolpermisos.actualizar')]
            },
            {
                path: 'seguridad/usuarios/:id/configuracion',
                loadComponent: () => import('./pages/seguridad/usuario-config/usuario-config.component')
                    .then(m => m.UsuarioConfigComponent),
                canActivate: [permisoGuard('usuariopermisos.actualizar')]
            },
            // Clínica
            {
                path: 'clinica/pacientes',
                loadComponent: () => import('./pages/clinica/pacientes/pacientes.component')
                    .then(m => m.PacientesComponent),
                canActivate: [permisoGuard('pacientes.leer')]
            },
            {
                path: 'clinica/pacientes/:id/historia',
                loadComponent: () => import('./pages/clinica/historia-clinica/historia-clinica.component')
                    .then(m => m.HistoriaClinicaComponent),
                canActivate: [permisoGuard('pacientes.leer')]
            },
            {
                path: 'clinica/especialidades',
                loadComponent: () => import('./pages/clinica/especialidades/especialidades.component')
                    .then(m => m.EspecialidadesComponent),
                canActivate: [permisoGuard('especialidades.leer')]
            },
            {
                path: 'clinica/medicos',
                loadComponent: () => import('./pages/clinica/medicos/medicos.component')
                    .then(m => m.MedicosComponent),
                canActivate: [permisoGuard('medicos.leer')]
            },
            {
                path: 'clinica/citas',
                loadComponent: () => import('./pages/clinica/citas/citas.component')
                    .then(m => m.CitasComponent),
                canActivate: [permisoGuard('citas.leer')]
            },
            {
                path: 'clinica/horarios',
                loadComponent: () => import('./pages/clinica/horarios/horarios.component')
                    .then(m => m.HorariosComponent),
                canActivate: [permisoGuard('medicos.leer')]
            },
            {
                path: 'clinica/consultas',
                loadComponent: () => import('./pages/clinica/consultas/consultas.component')
                    .then(m => m.ConsultasComponent),
                canActivate: [permisoGuard('consultas.leer')]
            },
            {
                path: 'clinica/consultas/:id',
                loadComponent: () => import('./pages/clinica/consulta-detalle/consulta-detalle.component')
                    .then(m => m.ConsultaDetalleComponent),
                canActivate: [permisoGuard('consultas.leer')]
            },
            {
                path: 'clinica/configuracion/cie10',
                loadComponent: () => import('./pages/clinica/cie10/cie10.component')
                    .then(m => m.Cie10Component),
                canActivate: [permisoGuard('cie10.leer')]
            },
            {
                path: 'clinica/configuracion/medicamentos',
                loadComponent: () => import('./pages/clinica/medicamentos/medicamentos.component')
                    .then(m => m.MedicamentosComponent),
                canActivate: [permisoGuard('medicamentos.leer')]
            },

            // Recetas
            {
                path: 'clinica/recetas/:id/vista',
                loadComponent: () => import('./pages/clinica/receta-vista/receta-vista.component')
                    .then(m => m.RecetaVistaComponent),
                canActivate: [permisoGuard('consultas.leer')]
            },

            // Catalogo de examenes
            {
                path: 'clinica/configuracion/examenes',
                loadComponent: () => import('./pages/clinica/catalogo-examenes/catalogo-examenes.component')
                    .then(m => m.CatalogoExamenesComponent),
                canActivate: [permisoGuard('laboratorio.leer')]
            },

            // Ordenes de laboratorio
            // {
            //     path: 'clinica/laboratorio',
            //     loadComponent: () => import('./pages/clinica/laboratorio/laboratorio.component')
            //         .then(m => m.LaboratorioComponent),
            //     canActivate: [permisoGuard('laboratorio.leer')]
            // },
            // Menu laboratorio
            {
                path: 'clinica/laboratorio',
                loadComponent: () => import('./pages/clinica/laboratorio/laboratorio.component')
                    .then(m => m.LaboratorioComponent),
                canActivate: [permisoGuard('laboratorio.leer')]
            },
            {
                path: 'clinica/laboratorio/pendientes',
                loadComponent: () => import('./pages/clinica/laboratorio/laboratorio.component')
                    .then(m => m.LaboratorioComponent),
                data: { estado: 'pendiente' },
                canActivate: [permisoGuard('laboratorio.leer')]
            },
            {
                path: 'clinica/laboratorio/en-proceso',
                loadComponent: () => import('./pages/clinica/laboratorio/laboratorio.component')
                    .then(m => m.LaboratorioComponent),
                data: { estado: 'en_proceso' },
                canActivate: [permisoGuard('laboratorio.leer')]
            },
            {
                path: 'clinica/laboratorio/completadas',
                loadComponent: () => import('./pages/clinica/laboratorio/laboratorio.component')
                    .then(m => m.LaboratorioComponent),
                data: { estado: 'completada' },
                canActivate: [permisoGuard('laboratorio.leer')]
            },

            // Imprimir ordenes de laboratorio
            {
                path: 'clinica/laboratorio/:id/orden',
                loadComponent: () => import('./pages/clinica/orden-lab-vista/orden-lab-vista.component')
                    .then(m => m.OrdenLabVistaComponent),
                canActivate: [permisoGuard('laboratorio.leer')]
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