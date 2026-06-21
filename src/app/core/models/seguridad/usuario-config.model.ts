export interface ConfiguracionUsuario {
    idUsuario: number;
    nombre: string;
    idRol: number | null;
    nombreRol: string | null;
    modulos: ModuloUsuarioConfig[];
}

export interface ModuloUsuarioConfig {
    idModulo: number;
    nombreModulo: string;
    menus: MenuUsuarioConfig[];
}

export interface MenuUsuarioConfig {
    idMenu: number;
    nombre: string;
    icono: string | null;
    ruta: string | null;
    orden: number;
    idModulo: number;
    idPadre: number | null;
    permisos: PermisoUsuarioConfig[];
    hijos: MenuUsuarioConfig[];
}

export interface PermisoUsuarioConfig {
    idPermiso: number;
    nombre: string;
    estadoRol: boolean;
    concedido: boolean | null;
}

export interface GuardarPermisoUsuario {
    idPermiso: number;
    concedido: boolean;
}

export interface GuardarConfiguracionUsuario {
    permisos: GuardarPermisoUsuario[];
}