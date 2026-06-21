export interface Cie10 {
    idCie10:         number;
    codigo:          string;
    descripcion:     string;
    categoria:       string | null;
    esPersonalizado: boolean;
    activo:          boolean;
    fechaRegistro:   string | null;
}

export interface Cie10Busqueda {
    idCie10:     number;
    codigo:      string;
    descripcion: string;
    categoria:   string | null;
}

export interface CrearCie10 {
    codigo:      string;
    descripcion: string;
    categoria:   string | null;
}