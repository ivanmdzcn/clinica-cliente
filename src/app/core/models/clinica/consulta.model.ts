export interface Consulta {
    idConsulta:           number;
    idPaciente:           number;
    nombrePaciente:       string | null;
    idMedico:             number;
    nombreMedico:         string | null;
    especialidadMedico:   string | null;
    idCita:               number | null;
    tipoConsulta:         string | null;
    motivoConsulta:       string;
    evolucionTratamiento: string | null;
    observaciones:        string | null;
    proximaCita:          string | null;
    estado:               string;
    fechaConsulta:        string | null;
    fechaActualizacion:   string | null;
}

export interface CrearConsulta {
    idPaciente:           number;
    idMedico:             number;
    idCita:               number | null;
    tipoConsulta:         string | null;
    motivoConsulta:       string;
    evolucionTratamiento: string | null;
    observaciones:        string | null;
    proximaCita:          string | null;
}

export interface ActualizarConsulta {
    tipoConsulta:         string | null;
    motivoConsulta:       string;
    evolucionTratamiento: string | null;
    observaciones:        string | null;
    proximaCita:          string | null;
    estado:               string;
}

export const TIPOS_CONSULTA = [
    { value: 'primera_vez',   label: 'Primera vez'   },
    { value: 'control',       label: 'Control'       },
    { value: 'emergencia',    label: 'Emergencia'    },
    { value: 'seguimiento',   label: 'Seguimiento'   },
    { value: 'procedimiento', label: 'Procedimiento' }
];

export const ESTADOS_CONSULTA = [
    { value: 'abierta',     label: 'Abierta',      color: '#1976d2', bg: '#e3f2fd' },
    { value: 'en_proceso',  label: 'En proceso',   color: '#f57c00', bg: '#fff3e0' },
    { value: 'cerrada',     label: 'Cerrada',      color: '#388e3c', bg: '#e8f5e9' }
];