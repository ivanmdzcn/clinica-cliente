export interface Antecedente {
    idAntecedente:  number;
    idPaciente:     number;
    tipo:           string;
    condicion:      string;
    descripcion:    string | null;
    fechaRegistro:  string | null;
    creadoPor:      number | null;
}

export interface CrearAntecedente {
    tipo:        string;
    condicion:   string;
    descripcion: string | null;
}

export interface ActualizarAntecedente {
    tipo:        string;
    condicion:   string;
    descripcion: string | null;
}

export const TIPOS_ANTECEDENTE = [
    { value: 'personal', label: 'Personal', icono: 'person'  },
    { value: 'familiar', label: 'Familiar', icono: 'family_restroom' }
];