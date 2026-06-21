export interface AgendaSlot {
    horaInicio:     string;
    horaFin:        string;
    disponible:     boolean;
    idCita:         number | null;
    idPaciente:     number | null;
    nombrePaciente: string | null;
    motivo:         string | null;
    estado:         string | null;
}

export interface AgendaDia {
    fecha:            string;
    diaSemanaNombre:  string;
    tieneHorario:     boolean;
    totalCitas:       number;
    totalDisponibles: number;
    slots:            AgendaSlot[];
}

export const ESTADOS_CITA = [
    { value: 'pendiente',   label: 'Pendiente',   color: '#f57c00', bg: '#fff3e0' },
    { value: 'confirmada',  label: 'Confirmada',  color: '#1976d2', bg: '#e3f2fd' },
    { value: 'completada',  label: 'Completada',  color: '#388e3c', bg: '#e8f5e9' },
    { value: 'cancelada',   label: 'Cancelada',   color: '#d32f2f', bg: '#ffebee' },
    { value: 'no_asistio',  label: 'No asistió',  color: '#757575', bg: '#f5f5f5' }
];