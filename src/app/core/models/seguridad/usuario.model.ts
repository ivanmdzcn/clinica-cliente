export interface Usuario {
    idUsuario: number;
    nombre: string;
    nombreUsuario: string;
    email: string;
    idRol: number | null;
    activo: boolean;
}

export interface CrearUsuario {
    nombre: string;
    nombreUsuario: string;
    email: string;
    contrasena: string;
    idRol: number | null;
}

export interface ActualizarUsuario {
    nombre: string;
    nombreUsuario: string;
    email: string;
    idRol: number | null;
    activo: boolean;
}