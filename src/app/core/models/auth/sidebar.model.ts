export interface ModuloMenu {
    idModulo: number;
    nombreModulo: string;
    menus: MenuArbol[];
}

export interface MenuArbol {
    idMenu: number;
    nombre: string;
    icono: string | null;
    ruta: string | null;
    orden: number;
    idPadre: number | null;
    idModulo: number;
    hijos: MenuArbol[];
}