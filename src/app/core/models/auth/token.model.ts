export interface Token {
    token: string;
    expiracion: string;
    idUsuario: number;
    nombre: string;
    email: string;
    idRol: number;
    permisos: string[];
    menus: MenuToken[];
}

export interface MenuToken {
    idMenu: number;
    nombre: string;
    ruta: string | null;
    icono: string | null;
    orden: number;
    idPadre: number | null;
    idModulo: number;
}