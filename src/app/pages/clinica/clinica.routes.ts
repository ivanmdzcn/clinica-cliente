import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso.guard'; // Verifica la ruta de tus guards

export const clinicaRoutes: Routes = [
    {
        path: 'pacientes',
        loadComponent: () => import('./pacientes/pacientes.component')
            .then(m => m.PacientesComponent),
        canActivate: [permisoGuard('pacientes.leer')]
    },
    {
        path: 'pacientes/:id/historia',
        loadComponent: () => import('./historia-clinica/historia-clinica.component')
            .then(m => m.HistoriaClinicaComponent),
        canActivate: [permisoGuard('pacientes.leer')]
    },
    {
        path: 'especialidades',
        loadComponent: () => import('./especialidades/especialidades.component')
            .then(m => m.EspecialidadesComponent),
        canActivate: [permisoGuard('especialidades.leer')]
    },
    {
        path: 'medicos',
        loadComponent: () => import('./medicos/medicos.component')
            .then(m => m.MedicosComponent),
        canActivate: [permisoGuard('medicos.leer')]
    },
    {
        path: 'citas',
        loadComponent: () => import('./citas/citas.component')
            .then(m => m.CitasComponent),
        canActivate: [permisoGuard('citas.leer')]
    },
    {
        path: 'horarios',
        loadComponent: () => import('./horarios/horarios.component')
            .then(m => m.HorariosComponent),
        canActivate: [permisoGuard('medicos.leer')]
    },
    {
        path: 'consultas',
        loadComponent: () => import('./consultas/consultas.component')
            .then(m => m.ConsultasComponent),
        canActivate: [permisoGuard('consultas.leer')]
    },
    {
        path: 'consultas/:id',
        loadComponent: () => import('./consulta-detalle/consulta-detalle.component')
            .then(m => m.ConsultaDetalleComponent),
        canActivate: [permisoGuard('consultas.leer')]
    },
    {
        path: 'configuracion/cie10',
        loadComponent: () => import('./cie10/cie10.component')
            .then(m => m.Cie10Component),
        canActivate: [permisoGuard('cie10.leer')]
    },
    {
        path: 'configuracion/medicamentos',
        loadComponent: () => import('./medicamentos/medicamentos.component')
            .then(m => m.MedicamentosComponent),
        canActivate: [permisoGuard('medicamentos.leer')]
    },
    {
        path: 'recetas/:id/vista',
        loadComponent: () => import('./receta-vista/receta-vista.component')
            .then(m => m.RecetaVistaComponent),
        canActivate: [permisoGuard('consultas.leer')]
    },
    {
        path: 'configuracion/examenes',
        loadComponent: () => import('./catalogo-examenes/catalogo-examenes.component')
            .then(m => m.CatalogoExamenesComponent),
        canActivate: [permisoGuard('laboratorio.leer')]
    },
    {
        path: 'laboratorio',
        loadComponent: () => import('./laboratorio/laboratorio.component')
            .then(m => m.LaboratorioComponent),
        canActivate: [permisoGuard('laboratorio.leer')]
    },
    {
        path: 'laboratorio/pendientes',
        loadComponent: () => import('./laboratorio/laboratorio.component')
            .then(m => m.LaboratorioComponent),
        data: { estado: 'pendiente' },
        canActivate: [permisoGuard('laboratorio.leer')]
    },
    {
        path: 'laboratorio/en-proceso',
        loadComponent: () => import('./laboratorio/laboratorio.component')
            .then(m => m.LaboratorioComponent),
        data: { estado: 'en_proceso' },
        canActivate: [permisoGuard('laboratorio.leer')]
    },
    {
        path: 'laboratorio/completadas',
        loadComponent: () => import('./laboratorio/laboratorio.component')
            .then(m => m.LaboratorioComponent),
        data: { estado: 'completada' },
        canActivate: [permisoGuard('laboratorio.leer')]
    },
    {
        path: 'laboratorio/:id/orden',
        loadComponent: () => import('./orden-lab-vista/orden-lab-vista.component')
            .then(m => m.OrdenLabVistaComponent),
        canActivate: [permisoGuard('laboratorio.leer')]
    }
];