export interface Diagnostico {
    idDiagnostico:   number;
    idConsulta:      number;
    idCie10:         number | null;
    codigoCie10:     string | null;
    descripcion:     string;
    tipo:            string;
    creadoPor:       number | null;
    nombreCreadoPor: string | null;
    fechaRegistro:   string | null;
    esDeCatalogo:    boolean;
}

export interface CrearDiagnostico {
    idConsulta:  number;
    idCie10:     number | null;
    codigoCie10: string | null;
    descripcion: string;
    tipo:        string;
}

export interface ActualizarDiagnostico {
    idCie10:     number | null;
    codigoCie10: string | null;
    descripcion: string;
    tipo:        string;
}

export const TIPOS_DIAGNOSTICO = [
    { value: 'presuntivo', label: 'Presuntivo', color: '#ff9800', bg: '#fff3e0' },
    { value: 'definitivo', label: 'Definitivo', color: '#1976d2', bg: '#e3f2fd' }
];