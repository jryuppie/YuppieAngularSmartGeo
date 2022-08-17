import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

import { MenuLateralService } from '../menu-lateral/menu-lateral.service';
import { csvRotas, ListaRotasCSV, Localizacao, RotasMaps } from '../models/csvRotas';
import { PrimeIcons } from 'primeng/api';
import { Message, MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-agendar-rotas',
  templateUrl: './agendar-rotas.component.html',
  styleUrls: ['./agendar-rotas.component.css'],
  providers: [MessageService]

})


export class AgendarRotasComponent implements OnInit {
  valorFileText: undefined;
  constructor(private menuLateralService: MenuLateralService, private http: HttpClient, private messageService: MessageService) { }

  //#region <VARIAVEIS DE AUTOCOMPLETE - GOOGLE API PLACES>    
  input1: any;
  input2: any;
  input3: any;
  input4: any;
  input5: any;
  input6: any;
  //#endregion
  //#region <VARIAVEIS DE EXIBIÇÃO/TELA>  
  parada2show: boolean = false;
  parada3show: boolean = false;
  parada4show: boolean = false;
  inputGrupo: boolean = false;
  isLoading: boolean = false;
  isAdd: boolean = false;
  isUpload: boolean = false;
  listaPontos: any;
  painelRotasVisualizar: boolean = true;
  envarRotasVisualizar: boolean = true;
  rotaManualVisualizar: boolean = true;
  fileName: string = '';
  //#endregion
  //#region <VARIAVEIS DE MANIPULAÇÃO DO MAPA>  
  stepDisplay: any;
  markerArray: any[] = [];
  rotasMapa: RotasMaps = new RotasMaps();
  rotasImportadas: Array<csvRotas> = new Array<csvRotas>();
  rotasCep: any[] = [];
  ListaGeocode: Array<Localizacao> = [];
  buscarPorCep: boolean = true;
  //#endregion
  //#region <VARIAVEIS PARA INICIALIZAÇÃO GOOGLE API'S>  
  geocoder: any;
  map: any;
  directionsService: any;
  directionsRenderer: any;
  //#endregion






  ngOnInit() {

    //ATRIBUIR TITULO A PAGINA
    (document.getElementById('h1Titulo') as HTMLElement).innerHTML = 'Planejar Rotas';

    //MANIPULAÇÃO DAS VARIAVEIS DE TELA
    this.buscarPorCep = true;
    this.parada2show = false;
    this.parada3show = false;
    this.parada4show = false;


    //INICIALIZAÇÃO DAS APIS DO GOOGLE -- TODO: REMOVER TOKEN ID PESSOAL
    let loader = new Loader({
      apiKey: 'AIzaSyCbu9PxUAnPqy2W1fyKwLANXFywzDyiDKI',
      libraries: ['places', 'geometry'],
      region: 'BR',
      language: 'pt-BR',
    });

    //MANIPUALÇAO DO MAPA APÓS INICIALIZAÇÃO DAS APIS -- AGUMAS FUNÇÕES DE MONITORAMENTO DE TELA DEVEM SER COLCOCADAS AQUI
    loader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.stepDisplay = new google.maps.InfoWindow();
      this.markerArray = [new google.maps.Marker];

      // mappId 57f03a0f789e26df
      this.map = new google.maps.Map(document.getElementById('mapAgendar')!, {
        mapId: '178c0b225e053393',
        center: { lat: -23.5489, lng: -46.6388 },
        zoom: 8,
        streetViewControl: false
      })
      this.directionsRenderer.setMap(this.map);
      this.directionsRenderer.setPanel(
        document.getElementById("sidebarPanel") as HTMLElement
      );

      const onChangeHandler = () => {
        this.calcularExibirRotas();
      };

      (document.getElementById("enviar") as HTMLElement).addEventListener(
        "click",
        onChangeHandler
      );

      //OPÇÕES DE INICIALIZAÇÃO DO MAPS - GOOGLE MAPS PLACE
      var options = {
        componentRestrictions: { country: "BR" },
        fields: ["address_components"],
        strictBounds: true,
        types: ['(cities)']
      }

      //MANIPUALÇÃO DOS CAMPOS PARA AUTOCOMPLETE - GOOGLE MAPS PLACE
      this.input1 = document.getElementById("partida");
      if (this.input1 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(this.input1, options);
      }

      this.input2 = document.getElementById("destino");
      if (this.input2 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(this.input2, options);
      }
      this.input3 = document.getElementById("parada");
      if (this.input3 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(this.input3, options);
      }

      this.input4 = document.getElementById("parada2");
      if (this.input4 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(this.input4, options);
      }
      this.input5 = document.getElementById("parada3");
      if (this.input5 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(this.input5, options);
      }
      this.input6 = document.getElementById("parada4");
      if (this.input6 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(this.input6, options);
      }
      //FIM DE MANIPUALÇÃO DOS CAMPOS PARA CONSULTA MANUAL


      //REMOVER INFORMAÇÕES DO GOOGLE MAPS DA TELA
      setTimeout(function () {
        (document.querySelector("#mapAgendar > div > div > div:nth-child(17) > div") as HTMLElement).style['display'] = 'none';
        (document.querySelector("#mapAgendar > div > div > div:nth-child(15) > div") as HTMLElement).style['display'] = 'none';
        (document.querySelector("#mapAgendar > div > div > div:nth-child(5) > div") as HTMLElement).style['display'] = 'none';

      }, 4000);
    });
  }

  //FUNÇÃO PRINCIPAL PARA CONSULTAR E EXIBIR ROTAS
  calcularExibirRotas(csv: boolean = false) {

    this.isLoading = true;
    let waypts: google.maps.DirectionsWaypoint[] = [];
    this.rotasMapa = new RotasMaps();

    if (!csv) {
      //TELA - MANUAL
      //###TRECHO RESPONSAVEL POR CAPTURAR WAYPOINTS E PARTIDA/DESTINO###
      waypts = this.capturarInputsWaypoints().waypts;
      if (this.rotasMapa.Destino != undefined && this.rotasMapa.Partida != undefined)
        this.buscarRotasPorCidade(waypts)
    } else if (!this.buscarPorCep && this.rotaManualVisualizar) {
      if (this.rotasImportadas != []) {
        //CSV - LATITUDE - LONGITUDE
        waypts = this.capturarWaypointsCSV();
        if (this.rotasMapa.Destino != undefined && this.rotasMapa.Partida != undefined)
          this.buscarRotasPorGeocode(csv, waypts)
      }
    } else if (this.buscarPorCep && this.rotaManualVisualizar) {
      //CSV - CEP
      waypts = this.capturarWaypointsCSV();
      if (this.rotasMapa.Destino != undefined && this.rotasMapa.Partida != undefined)
        this.buscarRotasPorCep();
    }
  }


  //#region <Google API - Directions - Consultar rotas>
  buscarRotasPorGeocode(csv: boolean, waypts: google.maps.DirectionsWaypoint[]) {
    this.directionsService.route(
      this.atribuirRequestLatLong(waypts))
      .then((response: any) => {
        this.directionsRenderer.setOptions({ polylineOptions: { strokeColor: '#F0F04D' } });
        this.directionsRenderer.setDirections(response);
        this.pegarParadasResponse(response);
        //this.mostrarParadas(response, markerArray, stepDisplay, map);
        this.isLoading = false;

      })
      .catch((e: any) => {
        this.isLoading = false
        this.messageService.add({ severity: 'warn', summary: 'Erro!', detail: e.message });
      });
  }

  buscarRotasPorCidade(waypts: google.maps.DirectionsWaypoint[]) {
    this.directionsService.route(
      this.atribuirRequestManual(waypts))
      .then((response: any) => {
        this.directionsRenderer.setOptions({ polylineOptions: { strokeColor: '#F0F04D' } });
        this.directionsRenderer.setDirections(response);
        this.pegarParadasResponse(response);
        // this.mostrarParadas(response, markerArray, stepDisplay, map);
        this.isLoading = false;

      })
      .catch((e: any) => {
        this.isLoading = false
        this.messageService.add({ severity: 'warn', summary: 'Erro!', detail: e.message });
      });
  }

  dividirLista(itens: any, maximo: any) {
    return itens.reduce((acumulador: any, item: any, indice: any) => {
      const grupo = Math.floor(indice / maximo);
      acumulador[grupo] = [...(acumulador[grupo] || []), item];
      return acumulador;
    }, []);
  };
  private async buscarRotasPorCep() {
    let wayptsGeocode: google.maps.DirectionsWaypoint[] = [];
    let rotasListaCEP: string[] = []
    this.rotasMapa.Paradas?.forEach((a) => { rotasListaCEP.push(a.CEP!) })
    this.ListaGeocode = [];
    let stringEnvio = this.rotasMapa.Partida?.CEP + '|' + this.rotasMapa.Destino?.CEP + '|' + rotasListaCEP.join('|');
    let splitRotas = stringEnvio.split('|');
    let unique = [...new Set(splitRotas)]
    var listaDividida = this.dividirLista(unique, 25)
    let ultimoCep = splitRotas[splitRotas.length - 1];
    //console.log(splitRotas)
    //console.log(listaDividida)


    
    if (listaDividida.length > 0) {
      var rotasPromisse: Promise<boolean>[] = []
      await listaDividida[0].forEach((item: any) => {
        rotasPromisse.push(
          new Promise((resolve, reject) => {

            let stringet = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + item + '&key=AIzaSyCbu9PxUAnPqy2W1fyKwLANXFywzDyiDKI&region=BR&language=pt-BR';
            this.http.get<any>(stringet).subscribe(data => {

              data.results[0]
              let cep: string = data.results[0].address_components[0].long_name.replace(/[^0-9]/g, '')!;
              let placeID: string = data.results[0].place_id;
              let localizacao: Localizacao = new Localizacao();
              localizacao.CEP = cep;
              localizacao.PlaceId = placeID;
              console.log(cep + ' - ' + placeID+ ' - ' + this.ListaGeocode.length)
              if (!this.ListaGeocode.some((a) => a.PlaceId === placeID)) {  this.ListaGeocode.push(localizacao);} 
              resolve(true)
            })
          })
        )
      });
      Promise.all(rotasPromisse).
        then(async (resolve) => {

          var placeIdPartida: string = '';
          var placeIdDestino: string = '';


          for (let item of this.ListaGeocode) {
            if (item.CEP == this.rotasMapa.Partida?.CEP) { placeIdPartida = item.PlaceId! }
            if (item.CEP == this.rotasMapa.Destino?.CEP) { placeIdDestino = item.PlaceId! }
          }
          
          if (placeIdPartida != '' && placeIdDestino != '') {            
            let unique = [...new Set(this.ListaGeocode)]      
            unique.forEach(element => {
             
               if (!wayptsGeocode.some((a) => a.location === element.PlaceId)) {
              if (element.CEP != this.rotasMapa.Partida?.CEP && element.CEP != this.rotasMapa.Destino?.CEP) {
                wayptsGeocode.push({
                  location: { placeId: element.PlaceId },
                  stopover: true,
                });              
              }
               }
            });
          };
          await this.consultarDirectionsService(placeIdPartida, placeIdDestino, wayptsGeocode)
        })
    }
    else { this.messageService.add({ severity: 'warn', summary: 'Erro!', detail: 'Erro na leitura do arquivo' }); }
  }



  private async consultarDirectionsService(partida: string, destino: string, waypoints: google.maps.DirectionsWaypoint[]) {
    this.directionsService.route(
      {
        origin: { placeId: partida },
        destination: { placeId: destino },
        waypoints: waypoints, travelMode: google.maps.TravelMode.DRIVING, optimizeWaypoints: true, region: 'BR'
      })
      .then((response: any) => {
        this.directionsRenderer.setOptions({ polylineOptions: { strokeColor: '#F0F04D' } });
        this.directionsRenderer.setDirections(response);
        this.pegarParadasResponse(response);
        // this.mostrarParadas(response, markerArray, stepDisplay, map);
        this.isLoading = false;
      })
      .catch((e: any) => {
        this.isLoading = false
        this.messageService.add({ severity: 'warn', summary: 'Erro!', detail: e.message });
      });
  }
  //#endregion

  //#region <Funções de utilizade Tela>
  manipularTipoImportacao(e: any) {
    this.buscarPorCep = e.value;
  }

  adicionarParadaTela() {
    this.isAdd = true;
    if (this.parada2show === false) {
      this.parada2show = true;
      this.isAdd = false;
      return;
    }

    if (this.parada3show === false) {
      this.parada3show = true;
      this.isAdd = false;
      return;
    }

    if (this.parada4show === false) {
      this.parada4show = true;
      this.isAdd = false;
      return;
    }
    this.isAdd = false;
  }

  rotaManualVisualizarFunc() {
    if (this.rotaManualVisualizar) {
      (document.getElementById('uploadFile2') as HTMLElement).style['display'] = 'inline-flex';
      // (document.getElementById('uploadFile')  as HTMLElement).style['display'] = 'inline-flex';
    }
    else {
      (document.getElementById('uploadFile2') as HTMLElement).style['display'] = 'none';
      // (document.getElementById('uploadFile')  as HTMLElement).style['display'] = 'none';

    }

  }
  //#endregion

  //#region <Funções de utilizade - Google API>
  atribuirRequestLatLong(waypts: google.maps.DirectionsWaypoint[]) {
    var listaDividida = this.dividirLista(waypts, 22)

    var request = { origin: {}, destination: {}, waypoints: listaDividida[0], travelMode: google.maps.TravelMode.DRIVING, optimizeWaypoints: true, region: 'BR' }

    //fazer retornar um request de route
    let lat = parseFloat(this.rotasMapa.Partida?.Latitude!)
    let lng = parseFloat(this.rotasMapa.Partida?.Longitude!)

    request = {
      origin: { lat, lng },
      destination: { lat, lng },
      waypoints: waypts,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
      region: 'BR',

    };
    lng = lng + 0.005
    request.destination = { lat, lng }

    return request;
  }
  atribuirRequestManual(waypts: google.maps.DirectionsWaypoint[]) {
    var request = { origin: {}, destination: {}, waypoints: waypts, travelMode: google.maps.TravelMode.DRIVING, optimizeWaypoints: true, region: 'BR' }

    //fazer retornar um request de route
    request = {
      origin: this.rotasMapa.Partida?.Cidade!,
      destination: this.rotasMapa.Destino?.Cidade!,
      waypoints: waypts,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
      region: 'BR',
    };
    return request;
  }

  pegarParadasResponse(response: any) {  debugger;
    let alfab = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let indexAlfa = 0
    const Legs = response!.routes[0]!.legs!;
    this.listaPontos = [];
    if (!this.rotaManualVisualizar) {
      for (let index = 0; index < Legs.length; index++) {
        if (index == 0) {
          const ponto: string = Legs[index].start_address;
          const distancia: string = '';//Legs[index].distance.text;
          const duracao: string = '';//Legs[index].duration.text;
          const letra = alfab[indexAlfa]
          let item: any = { a: ponto, b: distancia, c: duracao, d: letra }
          this.listaPontos.push(item);
          indexAlfa++
        }

        const ponto: string = Legs[index].end_address;
        const distancia: string = Legs[index].distance.text;
        const duracao: string = Legs[index].duration.text;
        const letra = alfab[indexAlfa]
        let item: any = { a: ponto, b: distancia, c: duracao, d: letra }
        this.listaPontos.push(item);
        indexAlfa++
      }
    }
    else {
      for (let index = 0; index < Legs.length; index++) {
        if (index == 0) {
          const c: string = Legs[index].start_address.split(',')[Legs[index].start_address.split(',').length === 4 ? 2 : 2];
          const d: string = Legs[index].start_address.split(',')[Legs[index].start_address.split(',').length === 4 ? 0 : 2] + ' - Início';
          const dr: string = '';//Legs[index].duration.text;
          const letra = alfab[indexAlfa]
          let item: any = { a: c, b: d, c: dr, d: letra }
          this.listaPontos.push(item);
          indexAlfa++
        }
        let cep: string = '';
        let endereco: string = '';
        let duracao: string = ';'
        switch (Legs[index].end_address.split(',').length) {
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


        const letra = alfab[indexAlfa]
        let item: any = { a: cep, b: endereco, c: duracao, d: letra }
        this.listaPontos.push(item);
        indexAlfa++
      }
      console.log(this.listaPontos);
    }


  }

  //Caputura inputs de tela e retorna lista de pontos de parada - Utilizado no tipo MANUAL
  capturarInputsWaypoints() {
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
      this.rotasMapa.Partida = partida
    }
    if ((document.getElementById("destino") as HTMLInputElement).value != '') {
      let destino = new csvRotas()
      destino.Cidade = (document.getElementById("destino") as HTMLInputElement).value
      this.rotasMapa.Destino = destino
    }
    return { waypts, partida, destino };
  }

  capturarWaypointsCSV() {
    let waypts: google.maps.DirectionsWaypoint[] = [];
    let arrayPartida = this.rotasImportadas.filter(r => r.PatridaDestino === true);

    if (arrayPartida != null && arrayPartida != undefined && arrayPartida.length > 0) {
      this.rotasMapa.Partida = arrayPartida[0];
      this.rotasMapa.Destino = arrayPartida[0];
    }

    const paradasImportadas: Array<csvRotas> = this.rotasImportadas.filter(r => r.PatridaDestino === false);
    this.rotasMapa.Paradas = paradasImportadas;

    paradasImportadas.forEach(element => {
      let lat: number = parseFloat(element.Latitude!);
      let lng: number = parseFloat(element.Longitude!);

      waypts.push({
        location: new google.maps.LatLng(lat, lng),
        stopover: true,
      });
    });

    return waypts;
  }

  mostrarParadas(
    directionResult: google.maps.DirectionsResult,
    markerArray: google.maps.Marker[],
    stepDisplay: google.maps.InfoWindow,
    map: google.maps.Map
  ) {

    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    const myRoute = directionResult!.routes[0]!.legs[0]!;

    for (let i = 0; i < myRoute.steps.length; i++) {
      const marker = (markerArray[i] =
        markerArray[i] || new google.maps.Marker());

      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      this.informacoesMostrarParadas(
        stepDisplay,
        marker,
        myRoute.steps[i].instructions,
        map
      );
    }
  }

  informacoesMostrarParadas(
    stepDisplay: google.maps.InfoWindow,
    marker: google.maps.Marker,
    text: string,
    map: google.maps.Map
  ) {
    google.maps.event.addListener(marker, "click", () => {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }
  //#endregion

  //#region <Manipulacao do arquivo importado>
  onFileSelected(event: Event) {
    this.rotasImportadas = [];
    this.rotasMapa = new RotasMaps();
    this.valorFileText = undefined;
    this.isUpload = true;
    const result = (event.target as HTMLInputElement).files;

    if (result != null) {
      const file: File = result[0];
      if (file) {
        this.fileName = file.name;
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.leituraArquivoRotas(fileReader)
        }
        fileReader.readAsText(file);
      }
    }
    this.isUpload = false;
  }


  leituraArquivoRotas(reader: FileReader) {

    let csv: any = reader.result;
    let allTextLines = [];
    allTextLines = csv.split(/\r|\n|\r/);

    //header tabela
    let headers = allTextLines[0].split(',');
    let data = headers;
    let tarr = [];
    for (let j = 0; j < headers.length; j++) {
      tarr.push(data[j]);
    }
    let tarrR = [];
    let arrl = allTextLines.length;
    let rows = [];
    for (let i = 1; i < arrl; i++) {
      if (allTextLines[i] != '') {
        let campos = allTextLines[i].split(',')
        let rotaRow: csvRotas = {
          IdFuncionario: campos[0],
          NomeFuncionario: campos[1],
          PatridaDestino: campos[2] === "SIM" ? true : false,
          Latitude: campos[3],
          Longitude: campos[4],
          Cidade: campos[5],
          Estado: campos[6],
          CEP: campos[7].length == 7 ? '0'.concat(campos[7]) : campos[7],
        };
        this.rotasImportadas?.push(rotaRow);
      }
    }
    if (this.rotasImportadas.length > 0) {
      //CHAMAR A FUNÇÃO DE MOSTRAR ROTAS NA TELA

      this.calcularExibirRotas(true)
    }

  }
  //#endregion

}


