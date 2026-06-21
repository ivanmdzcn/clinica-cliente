export interface HorarioMedico {
    idHorario:           number;
    idMedico:            number;
    nombreMedico:        string | null;
    diaSemana:           number;
    diaSemanaDescripcion: string;
    horaInicio:          string;
    horaFin:             string;
    duracionSlotMin:     number;
    activo:              boolean;
}

export interface CrearHorarioMedico {
    idMedico:        number;
    diaSemana:       number;
    horaInicio:      string;
    horaFin:         string;
    duracionSlotMin: number;
}

export interface ActualizarHorarioMedico {
    diaSemana:       number;
    horaInicio:      string;
    horaFin:         string;
    duracionSlotMin: number;
    activo:          boolean;
}

export const DIAS_SEMANA = [
    { value: 1, label: 'Lunes'     },
    { value: 2, label: 'Martes'    },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves'    },
    { value: 5, label: 'Viernes'   },
    { value: 6, label: 'Sábado'    },
    { value: 7, label: 'Domingo'   }
];