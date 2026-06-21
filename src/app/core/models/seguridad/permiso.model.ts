export interface Permiso {
    idPermiso: number;
    nombre: string;
    idMenu: number;
    nombreMenu: string | null;
}

export interface CrearPermiso {
    nombre: string;
    idMenu: number;
}

export interface ActualizarPermiso {
    nombre: string;
    idMenu: number;
}