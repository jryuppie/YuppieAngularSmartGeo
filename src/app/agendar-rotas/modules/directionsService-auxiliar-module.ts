import { layoutMarcadores } from './marcadores-modulo';
import { dividirLista } from './utilidade-modulo';

export function pegarRotasManualModulo(response: any) {
    let markerLista: any[] = [];
    let listaPontos: any[] = [];  
    let indexAlfa = 0;    
    const Legs = response!.routes[0]!.legs!;
    const labelNumerico = criarLabelNumerico(Legs)


    for (let index = 0; index < Legs.length; index++) {
        if (index == 0) {
            const cep: string = Legs[index].start_address;
            const distancia: string = '';//Legs[index].distance.text;
            const duracao: string = '';//Legs[index].duration.text;
            const posicao = labelNumerico[indexAlfa]
            let item: any = { a: cep, b: distancia, c: duracao, d: posicao }
            listaPontos.push(item);
            indexAlfa++
        }

        const cep: string = Legs[index].end_address;
        const distancia: string = Legs[index].distance.text;
        const duracao: string = Legs[index].duration.text;
        const posicao = labelNumerico[indexAlfa]
        let item: any = { a: cep, b: distancia, c: duracao, d: posicao }
        listaPontos.push(item);
        indexAlfa++
    }
    return listaPontos
}

export function pegarRotasAutomaticasModulo(response: any, map:any) {   
    let markerLista: any[] = [];
    let listaPontos: any[] = [];
    let indexAlfa = 0;
    const Legs = response!.routes[0]!.legs!;
   const labelNumerico = criarLabelNumerico(Legs)

    for (let index = 0; index < Legs.length; index++) {       
        if (index == 0) {
            const cep: string = Legs[index].start_address.split(',')[Legs[index].start_address.split(',').length === 4 ? 2 : 2];
            const endereco: string = Legs[index].start_address.split(',')[Legs[index].start_address.split(',').length === 4 ? 0 : 2] + ' - Início';
            const dr: string = '';//Legs[index].duration.text;
            const letra = labelNumerico[indexAlfa]
            let item: any = { a: cep, b: endereco, c: dr, d: letra }
            listaPontos.push(item);           
            indexAlfa++
        }
        let cep: string = '';
        let endereco: string = '';
        let duracao: string = ';'
        const length = Legs[index].end_address.split(',').length
        switch (length) {
            case 3:
                cep = Legs[index].end_address.split(',')[1];
                endereco = Legs[index].end_address.split(',')[0];
                duracao = Legs[index].duration.text;
                break;
            case 4:
                cep = Legs[index].end_address.split(',')[2];
                endereco = Legs[index].end_address.split(',')[0];
                duracao = Legs[index].duration.text;
                break;
            case 5:
                cep = Legs[index].end_address.split(',')[3];
                endereco = Legs[index].end_address.split(',')[0];
                duracao = Legs[index].duration.text;
                break;
            default:
                cep = Legs[index].end_address.split(',')[2];
                endereco = Legs[index].end_address.split(',')[0];
                duracao = Legs[index].duration.text;
                break;
        }
        const letra = labelNumerico[indexAlfa]
        let item: any = { a: cep, b: endereco, c: duracao, d: letra }
        listaPontos.push(item);
        layoutMarcadores(item, Legs[index].end_location, index == Legs.length - 1 ? true : false, map, markerLista);
        //TODO, COLCOAR OS MARCADORES REPETIDOS SEM SOBREPOSIÇÃO
        indexAlfa++
    }
    return listaPontos
}

function criarLabelNumerico(Legs:any){
    let labelNumerico = [];
    for (let i = 1; i <= Legs.length + 1; i++) {
        labelNumerico.push(i.toString());
    }
    return labelNumerico;
}

export function criarRequestManual(waypts: google.maps.DirectionsWaypoint[], cidadePartida:string , cidadeDestino:string ) {
    var request = { origin: {}, destination: {}, waypoints: waypts, travelMode: google.maps.TravelMode.DRIVING, optimizeWaypoints: true, region: 'BR' }
    //fazer retornar um request de route
    request = {
      origin: cidadePartida,
      destination: cidadeDestino,
      waypoints: waypts,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
      region: 'BR',
    };
    return request;
  }
  
  export function  criarRequestLatLong(waypts: google.maps.DirectionsWaypoint[], latitude:string , longitude:string) {
    let unique = [...new Set(waypts)]
    let listaDividida = dividirLista(unique, 22)
    let lat = parseFloat(latitude)
    let lng = parseFloat(longitude)
    let lngD = lng + 0.0001
    return {
      origin: { lat, lng },
      destination: { lat, lngD },
      waypoints: listaDividida[0],
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
      region: 'BR',
    };
  }