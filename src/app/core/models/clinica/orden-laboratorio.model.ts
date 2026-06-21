export interface ResultadoLaboratorio {
    idResultado:       number;
    idDetalle:         number;
    idParametro:       number;
    nombreParametro:   string | null;
    unidad:            string | null;
    valorReferencia:   string | null;
    ordenVisualizacion: number;
    resultado:         string | null;
    anormal:           boolean;
    observaciones:     string | null;
    fechaResultado:    string | null;
    registradoPor:     number | null;
    nombreRegistrador: string | null;
}

export interface OrdenLabDetalle {
    idDetalle:    number;
    idOrden:      number;
    idExamen:     number;
    codigoExamen: string | null;
    nombreExamen: string | null;
    estado:       string;
    fechaRegistro: string;
    resultados:   ResultadoLaboratorio[]; // ya está bien
}

export interface HistorialOrdenLab {
    idHistorial:    number;
    idOrden:        number;
    estadoAnterior: string | null;
    estadoNuevo:    string;
    observacion:    string | null;
    fechaCambio:    string;
    cambiadoPor:    number | null;
    nombreUsuario:  string | null;
}

export interface OrdenLaboratorio {
    idOrden:         number;
    idConsulta:      number;
    idPaciente:      number;
    idMedico:        number;
    idCie10:         number | null;
    codigoCie10:     string | null;
    numeroOrden:     string;
    fechaOrden:      string;
    urgente:         boolean;
    observaciones:   string | null;
    estado:          string;
    fechaRegistro:   string;
    creadoPor:       number | null;
    nombrePaciente:  string | null;
    nombreMedico:    string | null;
    nombreCreadoPor: string | null;
    detalle:         OrdenLabDetalle[];
}

export interface CrearOrdenLaboratorio {
    idConsulta:    number;
    idPaciente:    number;
    idMedico:      number;
    idCie10:       number | null;
    codigoCie10:   string | null;
    fechaOrden:    string;
    urgente:       boolean;
    observaciones: string | null;
    examenIds:     number[];
}

export interface CambiarEstadoOrden {
    estado:      string;
    observacion: string | null;
}

export interface GuardarResultado {
    idParametro:  number;
    resultado:    string | null;
    anormal:      boolean;
    observaciones: string | null;
}

export const ESTADOS_ORDEN = [
    { value: 'pendiente',   label: 'Pendiente',   color: '#f57c00', bg: '#fff3e0' },
    { value: 'en_proceso',  label: 'En Proceso',  color: '#1976d2', bg: '#e3f2fd' },
    { value: 'completada',  label: 'Completada',  color: '#388e3c', bg: '#e8f5e9' },
    { value: 'cancelada',   label: 'Cancelada',   color: '#d32f2f', bg: '#ffebee' }
];

export const ESTADOS_DETALLE = [
    { value: 'pendiente',   label: 'Pendiente',   color: '#f57c00' },
    { value: 'en_proceso',  label: 'En Proceso',  color: '#1976d2' },
    { value: 'completado',  label: 'Completado',  color: '#388e3c' }
];