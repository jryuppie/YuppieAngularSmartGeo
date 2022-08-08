export interface ListaRotasCSV {
    ListaRotas: [csvRotas]
}

export class csvRotas {
    IdFuncionario? : string;
    NomeFuncionario? : string;
    PatridaDestino? : boolean;
    Latitude? : string;
    Longitude? : string;
    Cidade? : string;
    Estado? : string;
    CEP? : string;
}


export class RotasMaps {    
    Partida? : csvRotas;
    Destino? : csvRotas; 
    Paradas?: Array<csvRotas>; 
}

export interface Localizacao {    
        Cidade: string,
        CEP: string,
        Estado: string,
        Logitude: string,
        Latitude: string   
}