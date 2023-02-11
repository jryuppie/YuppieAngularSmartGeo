import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { MenuLateralService } from '../menu-lateral/menu-lateral.service';
import { csvRotas, Localizacao, RotasMaps } from '../models/csvRotas';
import { Papa } from 'ngx-papaparse';
import { environment } from '../../environments/environment';
import { dividirLista } from './modules/utilidade-modulo';
import { criarVariavelExportacao, exportarRotaModule } from './modules/exportacao-modulo'
import { importarArquivoSelecionado } from './modules/importacao-modulo'
import { capturarWaypointsCSV, capturarInputsWaypoints } from './modules/waypoints-modulo'
import { pegarRotasManualModulo, pegarRotasAutomaticasModulo, criarRequestManual, criarRequestLatLong } from './modules/directionsService-auxiliar-module'
@Component({
  selector: 'app-agendar-rotas',
  templateUrl: './agendar-rotas.component.html',
  styleUrls: ['./agendar-rotas.component.css'],
  providers: [MessageService]
})


export class AgendarRotasComponent implements OnInit {
  public destroyed = new Subject<any>();
  valorFileText: undefined;
  constructor(private menuLateralService: MenuLateralService, private http: HttpClient, private messageService: MessageService, private router: Router, private papa: Papa) { }

  //#region <VARIAVEIS DE EXIBIÇÃO/TELA>   
  isLoading: boolean = false;
  isUpload: boolean = false;
  listaPontos: any;
  rotaAutomatica: boolean = true;
  fileName: string = '';
  importacaoAtiva: boolean = false;
  mostrarSidePanel: boolean = false;
  //#endregion
  //#region <VARIAVEIS DE MANIPULAÇÃO DO MAPA>  
  stepDisplay: any;
  markerLista: any[] = [];
  rotasMapa: RotasMaps = new RotasMaps();
  rotasImportadas: Array<csvRotas> = new Array<csvRotas>();
  ListaGeocode: Array<Localizacao> = [];
  buscarPorCep: boolean = true;
  selectedModalCEP: csvRotas = {};
  mostrarModalCEP: boolean = false;
  corRota: string = '';
  parsedData: any;
  labelsNumeric = [];
  rotasParaExport: Array<csvRotas> = new Array<csvRotas>();
  consultarRotasRepetidas: boolean = true;
  //#endregion
  //#region <VARIAVEIS PARA INICIALIZAÇÃO GOOGLE API'S>  
  geocoder: any;
  map: any;
  directionsService: any;
  directionsRenderer: any;
  apiKey: string = environment.apikey;
  //#endregion



  ngOnInit() {
    this.corRota = getComputedStyle(document.documentElement).getPropertyValue('--cor-base');
    //ATRIBUIR TITULO A PAGINA
    (document.getElementById('h1Titulo') as HTMLElement).innerHTML = 'Planejar Rotas';
    //INICIALIZAÇÃO DAS APIS DO GOOGLE -- TODO: REMOVER TOKEN ID PESSOAL
    let loader = new Loader({
      apiKey: this.apiKey,
      libraries: ['places', 'geometry'],
      region: 'BR',
      language: 'pt-BR',
    });

    //MANIPUALÇAO DO MAPA APÓS INICIALIZAÇÃO DAS APIS -- AlGUMAS FUNÇÕES DE MONITORAMENTO DE TELA DEVEM SER COLCOCADAS AQUI
    loader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true
      });
      this.stepDisplay = new google.maps.InfoWindow();
      // this.markerArray = [new google.maps.Marker];

      // mappId 57f03a0f789e26df
      this.map = new google.maps.Map(document.getElementById('mapAgendar')!, {
        mapId: '178c0b225e053393',
        center: { lat: -23.734836221085317, lng: -46.56740373222433 },
        zoom: 15,
        streetViewControl: false
      })
      this.directionsRenderer.setMap(this.map);
      this.directionsRenderer.setPanel(
        document.getElementById("sidebarPanel") as HTMLElement
      );

      const onChangeHandler = () => {
        this.calcularExibirRotas();
      };

      //REMOVER INFORMAÇÕES DO GOOGLE MAPS DA TELA
      const selectors = [
        "#mapAgendar > div > div > div:nth-child(17) > div",
        "#mapAgendar > div > div > div:nth-child(15) > div",
        "#mapAgendar > div > div > div:nth-child(5) > div"
      ];

      setTimeout(function () {
        selectors.forEach(selector => {
          const element = document.querySelector(selector) as HTMLElement;
          element.style.display = "none";
        });
      }, 4000);
    });
  }


  //FUNÇÃO PRINCIPAL PARA CONSULTAR E EXIBIR ROTAS
  calcularExibirRotas(csv: boolean = false) {
    debugger
    let BuscarPorGeocode = false //valor referente a consulta por latitude e longitude, no momento o mesmo está desativado.
    this.isLoading = true;
    const captura = csv ? capturarWaypointsCSV(this.rotasImportadas) : capturarInputsWaypoints();
    this.rotasMapa = captura.rotasMapa;

    //CSV - LATITUDE - LONGITUDE    
    if (!this.buscarPorCep && this.rotaAutomatica && this.rotasImportadas.length > 0 && this.rotasMapa.Destino && this.rotasMapa.Partida)
      this.buscarRotasPorCidadeOuGeocode(BuscarPorGeocode, captura.waypts)

    //CSV - CEP    
    if (this.buscarPorCep && this.rotaAutomatica && this.rotasMapa.Destino && this.rotasMapa.Partida)
      this.buscarRotasPorCep();
  }


  //#region <Google API - Directions - Consultar rotas>
  buscarRotasPorCidadeOuGeocode(geocode: boolean,waypts: google.maps.DirectionsWaypoint[]) {
    const requestDS = geocode?  criarRequestLatLong(waypts,this.rotasMapa.Partida?.Cidade!, this.rotasMapa.Destino?.Cidade!) :  criarRequestManual(waypts,this.rotasMapa.Partida?.Cidade!, this.rotasMapa.Destino?.Cidade!);
    this.directionsService.route(
      requestDS)
      .then((response: any) => {
        this.directionsRenderer.setOptions({ polylineOptions: { strokeColor: this.corRota } });
        this.directionsRenderer.setDirections(response);
        this.deletarMarcadores();
        this.listaPontos = !this.rotaAutomatica ? pegarRotasManualModulo(response) : pegarRotasAutomaticasModulo(response, this.map)
        this.rotasParaExport = criarVariavelExportacao(this.rotasImportadas, this.listaPontos);
        this.isLoading = false;
      })
      .catch((e: any) => {
        this.isLoading = false
        if (!environment.production)
          this.messageService.add({ sticky: true, severity: 'warn', summary: 'Erro!', detail: e.message });
      });
  }

  private async buscarRotasPorCep() {
    let wayptsGeocode: google.maps.DirectionsWaypoint[] = [];
    let rotasListaCEP: string[] = []
    this.rotasMapa.Paradas?.forEach((a) => { rotasListaCEP.push(a.CEP!) })
    this.ListaGeocode = [];
    let stringEnvio = this.rotasMapa.Partida?.CEP + '|' + this.rotasMapa.Destino?.CEP + '|' + rotasListaCEP.join('|');
    let splitRotas = stringEnvio.split('|');
    if (!this.consultarRotasRepetidas) {
      splitRotas = [...new Set(splitRotas)]
    }
    var listaDividida = dividirLista(splitRotas, 25)


    if (listaDividida.length > 0) {
      var rotasPromisse: Promise<boolean>[] = []
      await listaDividida[0].map((item: any) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${item}&key=${this.apiKey}&region=BR&language=pt-BR`;
        rotasPromisse.push(
          new Promise((resolve) => {
            this.http.get<any>(url).subscribe(({ status, results }) => {
              if (status == 'OK') {
                let cep: string = results[0]?.address_components[0].long_name.replace(/[^0-9]/g, '')!;
                let placeID: string = results[0]?.place_id;

                if (cep && placeID) {
                  let localizacao: Localizacao = new Localizacao();
                  localizacao.CEP = cep;
                  localizacao.PlaceId = placeID;

                  if (!this.consultarRotasRepetidas && this.ListaGeocode.some(a => a.PlaceId === placeID)) {
                    resolve(true)
                    return;
                  }

                  this.ListaGeocode.push(localizacao);
                }
              }
              resolve(true)
              if (status == 'ZERO_RESULTS') {
                this.messageService.add({ sticky: true, severity: 'info', summary: item, detail: 'CEP ou Coordenadas não encontrada!' });
              }
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
          if (listaDividida.length > 1) { this.messageService.add({ sticky: true, severity: 'info', summary: 'Limite de Rotas!', detail: 'Limite de 25 rotas atingido, as demais rotas não seram exibidas!' }); }
        })
    }
    else { this.messageService.add({ sticky: true, severity: 'warn', summary: 'Erro!', detail: 'Erro na leitura do arquivo' }); }
  }



  private async consultarDirectionsService(partida: string, destino: string, waypoints: google.maps.DirectionsWaypoint[]) {
    this.directionsService.route(
      {
        origin: { placeId: partida },
        destination: { placeId: destino },
        waypoints: waypoints, travelMode: google.maps.TravelMode.DRIVING, optimizeWaypoints: true, region: 'BR'
      })
      .then((response: any) => {
        this.deletarMarcadores();
        this.listaPontos = !this.rotaAutomatica ? pegarRotasManualModulo(response) : pegarRotasAutomaticasModulo(response, this.map)
        this.rotasParaExport = criarVariavelExportacao(this.rotasImportadas, this.listaPontos);
        this.directionsRenderer.setOptions({
          polylineOptions: {
            geodesic: true,
            strokeColor: this.corRota,
            strokeOpacity: 1.0,
            strokeWeight: 5,
            clickable: true,
          }
        });
        this.directionsRenderer.setDirections(response);
        this.isLoading = false;
        this.importacaoAtiva = true;
      })
      .catch((e: any) => {
        this.isLoading = false
        this.importacaoAtiva = false;
        this.messageService.add({ sticky: true, severity: 'warn', summary: 'Erro!', detail: e.message });
      });
  }
  //#endregion



  //#region <Funções de utilizade Tela>
  manipularTipoImportacao(e: any) {
    this.buscarPorCep = e.value;
  }


  rotaManualVisualizarFunc() {
    if (this.rotaAutomatica) {
      (document.getElementById('uploadFile2') as HTMLElement).style['display'] = 'inline-flex';
    }
    else {
      (document.getElementById('uploadFile2') as HTMLElement).style['display'] = 'none';
    }
  }
  //#endregion

  //#region <Funções de utilizade - Google API>
  exportarRota() {
    exportarRotaModule(this.rotasParaExport)
  }

  mostrarParadas(
    directionResult: google.maps.DirectionsResult,
    markerArray: google.maps.Marker[],
    stepDisplay: google.maps.InfoWindow,
    map: google.maps.Map
  ) {
    const rotaAtual = directionResult!.routes[0]!.legs[0]!;
    for (let i = 0; i < rotaAtual.steps.length; i++) {
      const marker = (new google.maps.Marker());

      marker.setMap(map);
      marker.setPosition(rotaAtual.steps[i].start_location);
      this.informacoesMostrarParadas(
        stepDisplay,
        marker,
        rotaAtual.steps[i].instructions,
        map
      );

    }
  }
  deletarMarcadores() {
    for (var i = 0; i < this.markerLista.length; i++) {
      this.markerLista[i].setMap(null);
    }
    this.markerLista = [];
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

  async onFileSelected(event: Event) {
    let retornoImportacao = await importarArquivoSelecionado(event, this.parsedData, this.papa);
    if (retornoImportacao.exibirRotas) {
      this.rotasMapa = retornoImportacao.rotasMapa
      this.rotasImportadas = retornoImportacao.rotasImportadas
      this.calcularExibirRotas(true)
    }
  }

  AbrirModalCEP(cep: string) {
    let cepTratado = cep.replace(/[^0-9]/g, '')!
    this.selectedModalCEP = this.rotasMapa.Paradas?.find(f => f.CEP == cepTratado)!
    this.mostrarModalCEP = true;
  }
}


