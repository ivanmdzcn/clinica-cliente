export interface MedicoEspecialidad {
    idEspecialidad:     number;
    nombreEspecialidad: string;
    esPrincipal:        boolean;
}

export interface AsignarEspecialidad {
    idEspecialidad: number;
    esPrincipal:    boolean;
}

export interface Medico {
    idMedico:            number;
    idUsuario:           number;
    nombreUsuario:       string | null;
    cedulaProfesional:   string;
    numeroColegiado:     string;
    consultorio:         string | null;
    telefonoConsultorio: string | null;
    firmaPath:           string | null;
    selloPath:           string | null;
    observaciones:       string | null;
    activo:              boolean;
    fechaRegistro:       string | null;
    fechaActualizacion:  string | null;
    especialidades:      MedicoEspecialidad[];
    especialidadPrincipal: string | null; // 👈 debe estar aquí
}

export interface CrearMedico {
    idUsuario:           number;
    cedulaProfesional:   string;
    numeroColegiado:     string;
    consultorio:         string | null;
    telefonoConsultorio: string | null;
    observaciones:       string | null;
    especialidades:      AsignarEspecialidad[];
}

export interface ActualizarMedico {
    cedulaProfesional:   string;
    numeroColegiado:     string;
    consultorio:         string | null;
    telefonoConsultorio: string | null;
    observaciones:       string | null;
    activo:              boolean;
    especialidades:      AsignarEspecialidad[];
}