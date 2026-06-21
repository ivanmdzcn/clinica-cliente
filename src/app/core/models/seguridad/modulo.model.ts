export interface Modulo {
    idModulo: number;
    nombre: string;
    activo: boolean;
}

export interface CrearModulo {
    nombre: string;
}

export interface ActualizarModulo {
    nombre: string;
    activo: boolean;
}