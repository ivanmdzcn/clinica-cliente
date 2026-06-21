export interface Rol {
    idRol: number;
    nombre: string;
    activo: boolean;
    descripcion: string | null;
    fechaCreacion: string;
    creadoPor: number | null;
}

export interface CrearRol {
    nombre: string;
    descripcion: string | null;
    creadoPor: number | null;
}

export interface ActualizarRol {
    nombre: string;
    descripcion: string | null;
    activo: boolean;
}