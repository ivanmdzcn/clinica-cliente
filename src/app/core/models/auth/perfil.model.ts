export interface Perfil {
    idUsuario: number;
    nombre: string;
    nombreUsuario: string;
    email: string;
    idRol: number | null;
    nombreRol: string | null;
    permisos: string[];
}