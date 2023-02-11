import { csvRotas, Localizacao, RotasMaps } from '../../models/csvRotas';

//Caputura inputs de tela e retorna lista de pontos de parada - Utilizado no tipo MANUAL
export function capturarInputsWaypoints() {
    let rotasMapa: RotasMaps = new RotasMaps();
    let waypts: google.maps.DirectionsWaypoint[] = [];
    let destino: string = '';
    let partida: string = '';
    if ((document.getElementById("parada") as HTMLInputElement).value != '') {
      waypts.push({
        location: (document.getElementById("parada") as HTMLInputElement).value,
        stopover: true,
      });
    }
    if ((document.getElementById("parada2") as HTMLInputElement).value != '') {
      waypts.push({
        location: (document.getElementById("parada2") as HTMLInputElement).value,
        stopover: true,
      });
    }

    if ((document.getElementById("parada3") as HTMLInputElement).value != '') {
      waypts.push({
        location: (document.getElementById("parada3") as HTMLInputElement).value,
        stopover: true,
      });
    }

    if ((document.getElementById("parada4") as HTMLInputElement).value != '') {
      waypts.push({
        location: (document.getElementById("parada4") as HTMLInputElement).value,
        stopover: true,
      });
    }
    if ((document.getElementById("partida") as HTMLInputElement).value != '') {
      let partida = new csvRotas()
      partida.Cidade = (document.getElementById("partida") as HTMLInputElement).value
      rotasMapa.Partida = partida
    }
    if ((document.getElementById("destino") as HTMLInputElement).value != '') {
      let destino = new csvRotas()
      destino.Cidade = (document.getElementById("destino") as HTMLInputElement).value
      rotasMapa.Destino = destino
    }
    return { waypts, rotasMapa };
  }

  export function capturarWaypointsCSV(rotasImportadas: Array<csvRotas> ) {
    let rotasMapa: RotasMaps = new RotasMaps();
    let waypts: google.maps.DirectionsWaypoint[] = [];
    let arrayPartida = rotasImportadas.filter(r => r.PartidaDestino === 'SIM');

    if (arrayPartida != null && arrayPartida != undefined && arrayPartida.length > 0) {
      rotasMapa.Partida = arrayPartida[0];
      rotasMapa.Destino = arrayPartida[0];
    }

    const paradasImportadas: Array<csvRotas> = rotasImportadas.filter(r => r.PartidaDestino === 'NAO');
    rotasMapa.Paradas = paradasImportadas;

    paradasImportadas.forEach(element => {
      let lat: number = parseFloat(element.Latitude!);
      let lng: number = parseFloat(element.Longitude!);

      waypts.push({
        location: new google.maps.LatLng(lat, lng),
        stopover: true,
      });
    });

    return { waypts, rotasMapa };
  }