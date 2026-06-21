export interface CatalogoParametro {
    idParametro:        number;
    idExamen:           number;
    nombre:             string;
    unidad:             string | null;
    valorReferencia:    string | null;
    ordenVisualizacion: number;
    activo:             boolean;
}

export interface CatalogoExamen {
    idExamen:      number;
    codigo:        string;
    nombre:        string;
    descripcion:   string | null;
    activo:        boolean;
    fechaRegistro: string;
    parametros:    CatalogoParametro[];
}

export interface CatalogoExamenBusqueda {
    idExamen:    number;
    codigo:      string;
    nombre:      string;
    descripcion: string | null;
}

export interface CrearCatalogoParametro {
    nombre:             string;
    unidad:             string | null;
    valorReferencia:    string | null;
    ordenVisualizacion: number;
}

export interface CrearCatalogoExamen {
    codigo:      string;
    nombre:      string;
    descripcion: string | null;
    parametros:  CrearCatalogoParametro[];
}