export interface ConfiguracionEmpresa {
    idEmpresa:                   number;
    razonSocial:                 string;
    nombreComercial:             string | null;
    numeroIdentificacionFiscal:  string | null;
    direccion:                   string;
    ciudad:                      string | null;
    estadoProvincia:             string | null;
    codigoPostal:                string | null;
    pais:                        string;
    telefonoPrincipal:           string | null;
    telefonoSecundario:          string | null;
    emailPrincipal:              string;
    emailSecundario:             string | null;
    sitioWeb:                    string | null;
    codigoMoneda:                string;
    simboloMoneda:               string;
    nombreMoneda:                string | null;
    posicionSimbolo:             string;
    separadorMiles:              string;
    separadorDecimales:          string;
    decimales:                   number;
    logoUrl:                     string | null;
    colorPrimario:               string | null;
    piePaginaDocumentos:         string | null;
    mensajeAgradecimiento:       string | null;
    fechaActualizacion:          string | null;
}

export interface GuardarConfiguracionEmpresa {
    razonSocial:                 string;
    nombreComercial:             string | null;
    numeroIdentificacionFiscal:  string | null;
    direccion:                   string;
    ciudad:                      string | null;
    estadoProvincia:             string | null;
    codigoPostal:                string | null;
    pais:                        string;
    telefonoPrincipal:           string | null;
    telefonoSecundario:          string | null;
    emailPrincipal:              string;
    emailSecundario:             string | null;
    sitioWeb:                    string | null;
    codigoMoneda:                string;
    simboloMoneda:               string;
    nombreMoneda:                string | null;
    posicionSimbolo:             string;
    separadorMiles:              string;
    separadorDecimales:          string;
    decimales:                   number;
    logoUrl:                     string | null;
    colorPrimario:               string | null;
    piePaginaDocumentos:         string | null;
    mensajeAgradecimiento:       string | null;
}