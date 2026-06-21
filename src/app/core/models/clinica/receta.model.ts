export interface RecetaDetalle {
    idDetalle:         number;
    idReceta:          number;
    idMedicamento:     number;
    nombreMedicamento: string;
    concentracion:     string | null;
    presentacion:      string | null;
    dosis:             string;
    frecuencia:        string;
    duracion:          string;
    indicaciones:      string | null;
    orden:             number;
}

export interface Receta {
    idReceta:        number;
    idConsulta:      number;
    idMedico:        number;
    nombreMedico:    string | null;
    cedulaMedico:    string | null;
    colegiadoMedico: string | null;
    firmaMedico:     string | null;
    selloMedico:     string | null;
    idPaciente:      number;
    nombrePaciente:  string | null;
    edadPaciente:    string | null;
    observaciones:   string | null;
    fechaEmision:    string;
    fechaRegistro:   string;
    creadoPor:       number | null;
    detalle:         RecetaDetalle[];
}

export interface CrearRecetaDetalle {
    idMedicamento: number;
    dosis:         string;
    frecuencia:    string;
    duracion:      string;
    indicaciones:  string | null;
    orden:         number;
}

export interface CrearReceta {
    idConsulta:    number;
    idMedico:      number;
    idPaciente:    number;
    observaciones: string | null;
    detalle:       CrearRecetaDetalle[];
}