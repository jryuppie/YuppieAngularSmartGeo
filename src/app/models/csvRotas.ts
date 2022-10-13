export interface ListaRotasCSV {
    ListaRotas: [csvRotas]
}

export class csvRotas {
    SequenciaOriginal?: number;
    NomeFuncionario?: string;
    PatridaDestino?: String;
    Latitude?: string;
    Longitude?: string;
    Cidade?: string;
    Estado?: string;
    CEP?: string;
    PlaceID?: string
    SequenciaOtimizada?:string;
    DataHoraConsulta?: string;
}


export class RotasMaps {
    Partida?: csvRotas;
    Destino?: csvRotas;
    Paradas?: Array<csvRotas>;
}

export class Localizacao {
    
    Cidade?: string
    CEP?: string
    Estado?: string
    Logitude?: string
    Latitude?: string
    PlaceId?: string
}