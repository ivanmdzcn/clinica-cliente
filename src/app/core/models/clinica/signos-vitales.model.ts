export interface SignosVitales {
    idSignos:              number;
    idConsulta:            number;
    tomadoPor:             number;
    nombreTomadoPor:       string | null;
    presionSistolica:      number | null;
    presionDiastolica:     number | null;
    temperatura:           number | null;
    frecuenciaCardiaca:    number | null;
    frecuenciaRespiratoria: number | null;
    saturacionOxigeno:     number | null;
    peso:                  number | null;
    altura:                number | null;
    glucosaCapilar:        number | null;
    nivelDolor:            number | null;
    observaciones:         string | null;
    fechaRegistro:         string | null;
    // Calculados en backend
    imc:                   number | null;
    presionArterial:       string | null;
}

export interface CrearSignosVitales {
    idConsulta:            number;
    tomadoPor:             number;
    presionSistolica:      number | null;
    presionDiastolica:     number | null;
    temperatura:           number | null;
    frecuenciaCardiaca:    number | null;
    frecuenciaRespiratoria: number | null;
    saturacionOxigeno:     number | null;
    peso:                  number | null;
    altura:                number | null;
    glucosaCapilar:        number | null;
    nivelDolor:            number | null;
    observaciones:         string | null;
}

export interface ActualizarSignosVitales {
    presionSistolica:      number | null;
    presionDiastolica:     number | null;
    temperatura:           number | null;
    frecuenciaCardiaca:    number | null;
    frecuenciaRespiratoria: number | null;
    saturacionOxigeno:     number | null;
    peso:                  number | null;
    altura:                number | null;
    glucosaCapilar:        number | null;
    nivelDolor:            number | null;
    observaciones:         string | null;
}

export const NIVELES_DOLOR = [
    { value: 0,  label: '0 — Sin dolor'      },
    { value: 1,  label: '1 — Muy leve'       },
    { value: 2,  label: '2 — Leve'           },
    { value: 3,  label: '3 — Leve-moderado'  },
    { value: 4,  label: '4 — Moderado'       },
    { value: 5,  label: '5 — Moderado'       },
    { value: 6,  label: '6 — Moderado-fuerte'},
    { value: 7,  label: '7 — Fuerte'         },
    { value: 8,  label: '8 — Muy fuerte'     },
    { value: 9,  label: '9 — Intenso'        },
    { value: 10, label: '10 — Insoportable'  }
];