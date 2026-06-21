export interface Alergia {
    idAlergia:             number;
    idPaciente:            number;
    medicamentoOElemento:  string;
    reaccion:              string | null;
    severidad:             string;
    fechaRegistro:         string | null;
    creadoPor:             number | null;
}

export interface CrearAlergia {
    medicamentoOElemento:  string;
    reaccion:              string | null;
    severidad:             string;
}

export interface ActualizarAlergia {
    medicamentoOElemento:  string;
    reaccion:              string | null;
    severidad:             string;
}

export const SEVERIDADES = [
    { value: 'leve',     label: 'Leve',     color: '#f57c00' },
    { value: 'moderada', label: 'Moderada', color: '#e65100' },
    { value: 'grave',    label: 'Grave',    color: '#c62828' }
];