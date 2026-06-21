export interface ConfiguracionRol {
    idRol: number;
    nombreRol: string;
    modulos: ModuloConfig[];
}

export interface ModuloConfig {
    idModulo: number;
    nombreModulo: string;
    menus: MenuConfig[];
}

export interface MenuConfig {
    idMenu: number;
    nombre: string;
    icono: string | null;
    ruta: string | null;
    orden: number;
    idModulo: number;
    idPadre: number | null;
    visibleSidebar: boolean;
    permisos: PermisoConfig[];
    hijos: MenuConfig[];
}

export interface PermisoConfig {
    idPermiso: number;
    nombre: string;
    asignado: boolean;
}

export interface GuardarMenuConfig {
    idMenu: number;
    visibleSidebar: boolean;
    idsPermisos: number[];
}

export interface GuardarConfiguracionRol {
    menus: GuardarMenuConfig[];
}