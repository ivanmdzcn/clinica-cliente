export interface Especialidad {
    idEspecialidad:     number;
    nombre:             string;
    descripcion:        string | null;
    activo:             boolean;
    fechaRegistro:      string | null;
    fechaActualizacion: string | null;
}

export interface CrearEspecialidad {
    nombre:      string;
    descripcion: string | null;
}

export interface ActualizarEspecialidad {
    nombre:      string;
    descripcion: string | null;
    activo:      boolean;
}