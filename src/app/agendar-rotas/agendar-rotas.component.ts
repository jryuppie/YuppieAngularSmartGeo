import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

import { MenuLateralService } from '../menu-lateral/menu-lateral.service';
import { csvRotas, ListaRotasCSV, Localizacao, RotasMaps } from '../models/csvRotas';
import { PrimeIcons } from 'primeng/api';
import {Message,MessageService} from 'primeng/api';

@Component({
  selector: 'app-agendar-rotas',
  templateUrl: './agendar-rotas.component.html',
  styleUrls: ['./agendar-rotas.component.css'],
  providers: [MessageService]
 
})
export class AgendarRotasComponent implements OnInit {
  valorFileText: undefined;
  constructor(private menuLateralService: MenuLateralService, private http: HttpClient,private messageService: MessageService) { }
  input1: any;
  input2: any;
  input3: any;
  input4: any;
  input5: any;
  input6: any;

  //VARIAVEIS DE TELA
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
  //FIM VARIVEIS DE TELA
  map: any;
  directionsService: any;
  directionsRenderer: any;
  stepDisplay: any;
  markerArray: any[] = [];
  rotasMapa: RotasMaps = new RotasMaps();
  rotasImportadas: Array<csvRotas> = new Array<csvRotas>();
  geocoder: any;
  rotasCep: any[] = [];
  ListaGeocode: Array<string> = [];

  buscarPorCep: boolean = true;

  handleChange(e: any) {
    this.buscarPorCep = e.value;
  }

  ngOnInit() {
    (document.getElementById('h1Titulo') as HTMLElement).innerHTML = 'Planejar Rotas';
    this.buscarPorCep = true;


    this.parada2show = false;
    this.parada3show = false;
    this.parada4show = false;

    let loader = new Loader({
      apiKey: 'AIzaSyCbu9PxUAnPqy2W1fyKwLANXFywzDyiDKI',
      libraries: ['places', 'geometry'],
      region: 'BR',
      language: 'pt-BR',
    });

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
        this.calculateAndDisplayRoute();
      };
      (document.getElementById("enviar") as HTMLElement).addEventListener(
        "click",
        onChangeHandler
      );

      var options = {
        componentRestrictions: { country: "BR" },
        fields: ["address_components"],
        strictBounds: true,
        types: ['(cities)']
      }

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


      setTimeout(function () {
        (document.querySelector("#mapAgendar > div > div > div:nth-child(17) > div") as HTMLElement).style['display'] = 'none';
        (document.querySelector("#mapAgendar > div > div > div:nth-child(15) > div") as HTMLElement).style['display'] = 'none';
        (document.querySelector("#mapAgendar > div > div > div:nth-child(5) > div") as HTMLElement).style['display'] = 'none';

      }, 4000);
    });




  }
  calculateAndDisplayRoute(
    csv: boolean = false
  ) {


    var partida = ''
    var destino = ''
    const waypts: google.maps.DirectionsWaypoint[] = [];
    if (!csv) {
      this.isLoading = true;
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
    } else {
      if (this.rotasImportadas != []) {

        let arrayPartida = this.rotasImportadas.filter(r => r.PatridaDestino === true);

        if (arrayPartida != null && arrayPartida != undefined && arrayPartida.length > 0) {
          this.rotasMapa.Partida = arrayPartida[0];
          this.rotasMapa.Destino = arrayPartida[0];
        }

        const paradasImportadas: Array<csvRotas> = this.rotasImportadas.filter(r => r.PatridaDestino === false);
        this.rotasMapa.Paradas = paradasImportadas;
        


        partida = this.rotasMapa.Partida?.Latitude! + this.rotasMapa.Partida?.Longitude!;
        destino = this.rotasMapa.Partida?.Latitude! + this.rotasMapa.Partida?.Longitude!;

        paradasImportadas.forEach(element => {
          let lat: number = parseFloat(element.Latitude!);
          let lng: number = parseFloat(element.Longitude!);

          waypts.push({
            location: new google.maps.LatLng(lat, lng),
            stopover: true,
          });
        });
      }
    }


    if (this.rotasMapa.Destino != undefined && this.rotasMapa.Partida != undefined) {

      if (this.buscarPorCep && this.rotaManualVisualizar)
        this.buscarRotasPorCep();
      else
        this.buscarRotasPorGeocode(csv, waypts)
    }
  }


  buscarRotasPorGeocode(csv: boolean, waypts: google.maps.DirectionsWaypoint[]) {
    
    this.directionsService.route(
      this.atribuirRequest(csv, waypts))
      .then((response: any) => {
        this.directionsRenderer.setOptions({ polylineOptions: { strokeColor: '#F0F04D' } });
        this.directionsRenderer.setDirections(response);
        this.getLegs(response);
        // this.showSteps(response, markerArray, stepDisplay, map);
        this.isLoading = false;

      })
      .catch((e: any) => {
        this.isLoading = false
        this.messageService.add({severity:'warn', summary:'Erro!', detail:e.message});
      });
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  buscarRotasPorCep() {
    const wayptsGeocode: google.maps.DirectionsWaypoint[] = [];
    let rotasListaCEP: string[] = []
    this.rotasMapa.Paradas?.forEach((a) => { rotasListaCEP.push(a.CEP!) })
    this.ListaGeocode = [];
    let stringEnvio = this.rotasMapa.Partida?.CEP + '|' + this.rotasMapa.Destino?.CEP + '|' + rotasListaCEP.join('|')
    

    let teste = stringEnvio.split('|')
    let loop = true;
    var bar = new Promise((resolve, reject) => {
      for (const item of teste) {
        const retorno = this.geocoder.geocode({ address: item }).then((retorno: any) => {
          this.ListaGeocode.push(retorno.results[0].place_id)
          if (this.ListaGeocode.length === teste.length )
            resolve(true);
        }).catch((e:any)=>{          
          this.messageService.add({severity:'warn', summary:'Erro!', detail:e.message});                
        })
      }
    });
    bar.then(() => {
      
      this.ListaGeocode.forEach((tem: string, index: number) => {
        if (index > 1) {
          wayptsGeocode.push({
            location: { placeId: tem },
            stopover: true,
          });
        }
      })
      this.directionsService.route(
        {
          origin: { placeId: this.ListaGeocode[0] },
          destination: { placeId: this.ListaGeocode[1] },
          waypoints: wayptsGeocode, travelMode: google.maps.TravelMode.DRIVING, optimizeWaypoints: true, region: 'BR'
        })
        .then((response: any) => {
          this.directionsRenderer.setOptions({ polylineOptions: { strokeColor: '#F0F04D' } });
          this.directionsRenderer.setDirections(response);
          this.getLegs(response);
          // this.showSteps(response, markerArray, stepDisplay, map);
          this.isLoading = false;
        })
        .catch((e: any) => {
          this.isLoading = false
          this.messageService.add({severity:'warn', summary:'Erro!', detail:e.message});
        });

    })

  }













  getLegs(response: any) {
    let alfab = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let indexAlfa = 0
    
    const Legs = response!.routes[0]!.legs!;
    this.listaPontos = [];
    for (let index = 0; index < Legs.length; index++) {
      if (index == 0) {
        const ponto: string = Legs[index].start_address.split(',')[Legs[index].start_address.split(',').length === 4 ? 1 : 2];
        const distancia: string = '';//Legs[index].distance.text;
        const duracao: string = '';//Legs[index].duration.text;
        const letra = alfab[indexAlfa]
        let item: any = { a: ponto, b: distancia, c: duracao, d: letra }
        this.listaPontos.push(item);
        indexAlfa++
      }
      const ponto: string = Legs[index].end_address.split(',')[Legs[index].end_address.split(',').length === 4 ? 1 : 2];
      const distancia: string = Legs[index].distance.text;
      const duracao: string = Legs[index].duration.text;
      const letra = alfab[indexAlfa]
      let item: any = { a: ponto, b: distancia, c: duracao, d: letra }
      this.listaPontos.push(item);
      indexAlfa++
    }
    
  }

  showSteps(
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
      this.attachInstructionText(
        stepDisplay,
        marker,
        myRoute.steps[i].instructions,
        map
      );
    }
  }
  attachInstructionText(
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



  onFileSelected(event: Event) {
    this.valorFileText = undefined;
    this.isUpload = true;
    const result = (event.target as HTMLInputElement).files;

    if (result != null) {
      const file: File = result[0];
      if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("rotas", file);
        

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
    this.rotasImportadas = [];
    this.rotasMapa = new RotasMaps();
    let csv: any = reader.result;
    let allTextLines = [];
    allTextLines = csv.split(/\r|\n|\r/);

    //header tabela
    let headers = allTextLines[0].split(';');
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
          CEP: campos[7],
        };
        this.rotasImportadas?.push(rotaRow);
      }
    }
    if (this.rotasImportadas.length > 0) {
      //CHAMAR A FUNÇÃO DE MOSTRAR ROTAS NA TELA
      this.calculateAndDisplayRoute(true)
    }

  }
  atribuirRequest(csv: boolean, waypts: google.maps.DirectionsWaypoint[]) {


    var request = { origin: {}, destination: {}, waypoints: waypts, travelMode: google.maps.TravelMode.DRIVING, optimizeWaypoints: true, region: 'BR' }

    //fazer retornar um request de route
    if (csv) {
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

    } else {
      request = {
        origin: this.rotasMapa.Partida?.Cidade!,
        destination: this.rotasMapa.Destino?.Cidade!,
        waypoints: waypts,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        region: 'BR',
      };
    }
    return request;
  }

}


