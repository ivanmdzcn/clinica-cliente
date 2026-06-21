export interface Paciente {
    idPaciente:          number;
    dpi:                 string | null;
    nombres:             string;
    apellidos:           string;
    nombreCompleto:      string;
    fechaNacimiento:     string;
    sexo:                string;
    estadoCivil:         string | null;
    ocupacion:           string | null;
    tipoSangre:          string | null;
    telefono:            string | null;
    telefonoEmergencia:  string | null;
    nombreEmergencia:    string | null;
    direccion:           string | null;
    email:               string | null;
    activo:              boolean;
    fechaRegistro:       string | null;
    fechaActualizacion:  string | null;
}

export interface CrearPaciente {
    dpi:                 string | null;
    nombres:             string;
    apellidos:           string;
    fechaNacimiento:     string | null; // 👈
    sexo:                string;
    estadoCivil:         string | null;
    ocupacion:           string | null;
    tipoSangre:          string | null;
    telefono:            string | null;
    telefonoEmergencia:  string | null;
    nombreEmergencia:    string | null;
    direccion:           string | null;
    email:               string | null;
}

export interface ActualizarPaciente {
    dpi:                 string | null;
    nombres:             string;
    apellidos:           string;
    fechaNacimiento:     string | null; // 👈
    sexo:                string;
    estadoCivil:         string | null;
    ocupacion:           string | null;
    tipoSangre:          string | null;
    telefono:            string | null;
    telefonoEmergencia:  string | null;
    nombreEmergencia:    string | null;
    direccion:           string | null;
    email:               string | null;
    activo:              boolean;
}

// Opciones para selects
export const SEXOS = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino',  label: 'Femenino'  },
    { value: 'otro',      label: 'Otro'       }
];

export const ESTADOS_CIVILES = [
    { value: 'soltero',     label: 'Soltero/a'     },
    { value: 'casado',      label: 'Casado/a'       },
    { value: 'divorciado',  label: 'Divorciado/a'   },
    { value: 'viudo',       label: 'Viudo/a'        },
    { value: 'union_libre', label: 'Unión libre'    }
];

export const TIPOS_SANGRE = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];