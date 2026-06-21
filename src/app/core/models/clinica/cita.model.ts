export interface Cita {
    idCita:              number;
    idPaciente:          number;
    nombrePaciente:      string | null;
    idMedico:            number;
    nombreMedico:        string | null;
    especialidadMedico:  string | null;
    fechaCita:           string;
    horaCita:            string;
    estado:              string;
    motivoCancelacion:   string | null;
    observaciones:       string | null;
    fechaRegistro:       string | null;
    fechaActualizacion:  string | null;
}

export interface CitaHistorial {
    idHistorial:    number;
    idCita:         number;
    estadoAnterior: string;
    estadoNuevo:    string;
    motivo:         string | null;
    fechaCambio:    string;
    cambiadoPor:    number | null;
    nombreUsuario:  string | null;
}

export interface CrearCita {
    idPaciente:    number;
    idMedico:      number;
    fechaCita:     string;
    horaCita:      string;
    observaciones: string | null;
}

export interface ActualizarCita {
    fechaCita:     string;
    horaCita:      string;
    observaciones: string | null;
}

export interface CambiarEstadoCita {
    estado:             string;
    motivoCancelacion:  string | null;
}

export interface SlotDisponible {
    horaInicio:  string;
    horaFin:     string;
    disponible:  boolean;
}

export const ESTADOS_CITA = [
    { value: 'pendiente',   label: 'Pendiente',    color: '#f57c00', bg: '#fff3e0', icono: 'schedule'       },
    { value: 'confirmada',  label: 'Confirmada',   color: '#1976d2', bg: '#e3f2fd', icono: 'check_circle'   },
    { value: 'completada',  label: 'Completada',   color: '#388e3c', bg: '#e8f5e9', icono: 'task_alt'       },
    { value: 'cancelada',   label: 'Cancelada',    color: '#c62828', bg: '#ffebee', icono: 'cancel'         },
    { value: 'no_asistio',  label: 'No asistió',   color: '#7b1fa2', bg: '#f3e5f5', icono: 'person_off'     }
];