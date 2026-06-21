export interface Menu {
    idMenu: number;
    nombre: string;
    descripcion: string | null;
    icono: string | null;
    ruta: string | null;
    orden: number;
    idPadre: number | null;
    idModulo: number;
    activo: boolean;
    creadoEn: string;
    creadoPor: number | null;
}

export interface CrearMenu {
    nombre: string;
    descripcion: string | null;
    icono: string | null;
    ruta: string | null;
    orden: number;
    idPadre: number | null;
    idModulo: number;
    creadoPor: number | null;
}

export interface ActualizarMenu {
    nombre: string;
    descripcion: string | null;
    icono: string | null;
    ruta: string | null;
    orden: number;
    idPadre: number | null;
    idModulo: number;
    activo: boolean;
}

export interface MenuArbolAdmin {
    idMenu: number;
    nombre: string;
    descripcion: string | null;
    icono: string | null;
    ruta: string | null;
    orden: number;
    idPadre: number | null;
    idModulo: number;
    hijos: MenuArbolAdmin[];
}