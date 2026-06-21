export interface Medicamento {
    idMedicamento:      number;
    nombre:             string;
    nombreComercial:    string | null;
    concentracion:      string | null;
    presentacion:       string | null;
    laboratorio:        string | null;
    imagenPath:         string | null;
    codigoBarras:       string | null;
    tipoMedicamento:    string;
    requiereReceta:     boolean;
    descripcion:        string | null;
    activo:             boolean;
    fechaRegistro:      string;
    fechaActualizacion: string | null;
}

export interface MedicamentoBusqueda {
    idMedicamento:   number;
    nombre:          string;
    nombreComercial: string | null;
    concentracion:   string | null;
    presentacion:    string | null;
    laboratorio:     string | null;
    tipoMedicamento: string;
    requiereReceta:  boolean;
}

export interface CrearMedicamento {
    nombre:          string;
    nombreComercial: string | null;
    concentracion:   string | null;
    presentacion:    string | null;
    laboratorio:     string | null;
    codigoBarras:    string | null;
    tipoMedicamento: string;
    requiereReceta:  boolean;
    descripcion:     string | null;
}

export interface ActualizarMedicamento {
    nombre:          string;
    nombreComercial: string | null;
    concentracion:   string | null;
    presentacion:    string | null;
    laboratorio:     string | null;
    codigoBarras:    string | null;
    tipoMedicamento: string;
    requiereReceta:  boolean;
    descripcion:     string | null;
    activo:          boolean;
}

export const TIPOS_MEDICAMENTO = [
    { value: 'receta_medica', label: 'Receta Médica', color: '#d32f2f', bg: '#ffebee' },
    { value: 'controlado',   label: 'Controlado',    color: '#e65100', bg: '#fff3e0' },
    { value: 'venta_libre',  label: 'Venta Libre',   color: '#2e7d32', bg: '#e8f5e9' }
];