export interface Tratamiento {
    idTratamiento:    number;
    idConsulta:       number;
    tipo:             string;
    descripcion:      string;
    indicaciones:     string | null;
    fechaInicio:      string | null;
    fechaFin:         string | null;
    estado:           string;
    motivoSuspension: string | null;
    fechaRegistro:    string;
    creadoPor:        number | null;
    nombreCreadoPor:  string | null;
}

export interface CrearTratamiento {
    idConsulta:   number;
    tipo:         string;
    descripcion:  string;
    indicaciones: string | null;
    fechaInicio:  string | null;
    fechaFin:     string | null;
}

export interface ActualizarTratamiento {
    tipo:             string;
    descripcion:      string;
    indicaciones:     string | null;
    fechaInicio:      string | null;
    fechaFin:         string | null;
    estado:           string;
    motivoSuspension: string | null;
}

export const TIPOS_TRATAMIENTO = [
    { value: 'farmacologico',    label: 'Farmacológico',     color: '#1976d2', bg: '#e3f2fd' },
    { value: 'no_farmacologico', label: 'No Farmacológico',  color: '#388e3c', bg: '#e8f5e9' }
];

export const ESTADOS_TRATAMIENTO = [
    { value: 'activo',     label: 'Activo',     color: '#1976d2', bg: '#e3f2fd' },
    { value: 'completado', label: 'Completado', color: '#388e3c', bg: '#e8f5e9' },
    { value: 'suspendido', label: 'Suspendido', color: '#d32f2f', bg: '#ffebee' }
];