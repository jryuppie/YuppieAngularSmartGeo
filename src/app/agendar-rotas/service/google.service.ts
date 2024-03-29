
import { Injectable, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { csvRotas, Localizacao, RotasMaps } from '../../models/csvRotas';
import { dividirLista } from '../modules/utilidade-modulo';
import { pegarRotasManualModulo, pegarRotasAutomaticasModulo, criarRequestManual, criarRequestLatLong } from '../modules/directionsService-auxiliar-module'
import { criarVariavelExportacao, exportarRotaModule } from '../modules/exportacao-modulo'
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

declare var google: any;
@Injectable({
  providedIn: 'root'
})


export class GoogleService {
  private listaPontosSubject = new Subject<any>();
  public listaPontos$ = this.listaPontosSubject.asObservable();
  private rotasParaExportSubject = new Subject<any>();
  public rotasParaExport$ = this.rotasParaExportSubject.asObservable();
  private importacaoAtivaSubject = new Subject<any>();
  public importacaoAtiva$ = this.importacaoAtivaSubject.asObservable();
  

  //#region <VARIAVEIS PARA INICIALIZAÇÃO GOOGLE API'S>  
  geocoder: any;
  googleMap: any;
  directionsService: any;
  directionsRenderer: any;
  apiKey: string = environment.apikey;
  stepDisplay: any;
  loader = new Loader({
    apiKey: this.apiKey,
    libraries: ['places', 'geometry'],
    region: 'BR',
    language: 'pt-BR',
  });
  //#endregion

  //#region <VARIAVEIS DE MANIPULAÇÃO DO MAPA>   
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


  //#region <VARIAVEIS DE EXIBIÇÃO/TELA>  

  isUpload: boolean = false;
  listaPontos: any;
  rotaAutomatica: boolean = true;
  fileName: string = '';
  importacaoAtiva: boolean = false;
  mostrarSidePanel: boolean = false;
  //#endregion
  constructor(private http: HttpClient, private messageService: MessageService) { }


  public atualizarListaPontos(listaPontos: any) {
    this.listaPontosSubject.next(listaPontos);
  }

  public atualizarRotasMapa(rotasMapa: any) {
    this.rotasParaExportSubject.next(rotasMapa);
  }
  public atualizaImportacaoAtiva(ativo: boolean){
    this.importacaoAtivaSubject.next(ativo)
  }

  loadGoogle(): Promise<any> {
    return new Promise((resolve, reject) => {  
      if (typeof this.loader === 'undefined') {
        this.loader = new Loader({
          apiKey: this.apiKey,
          libraries: ['places', 'geometry'],
          region: 'BR',
          language: 'pt-BR',
        });
      } else {       
        resolve(true);
      }
    });
  }

  carregarGoogleMaps() {
    //MANIPUALÇAO DO MAPA APÓS INICIALIZAÇÃO DAS APIS -- AlGUMAS FUNÇÕES DE MONITORAMENTO DE TELA DEVEM SER COLCOCADAS AQUI
    this.loader.load().then(() => {
      this.googleMap = new google.maps.Map(document.getElementById('mapAgendar')!, {
        mapId: '178c0b225e053393',
        center: { lat: -23.734836221085317, lng: -46.56740373222433 },
        zoom: 15,
        streetViewControl: false
      })

      this.geocoder = new google.maps.Geocoder();
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        markerOptions: {
          visible: false
        },
        map: this.googleMap,
        panel:  document.getElementById("sidebarPanel") as HTMLElement,
      });
      
      this.stepDisplay = new google.maps.InfoWindow(); 

      // const onChangeHandler = () => {
      //   this.calcularExibirRotas();
      // };

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

  public async buscarRotasPorCidadeOuGeocodeService(geocode: boolean, waypts: google.maps.DirectionsWaypoint[]) {
    const requestDS = geocode ? criarRequestLatLong(waypts, this.rotasMapa.Partida?.Cidade!, this.rotasMapa.Destino?.Cidade!) : criarRequestManual(waypts, this.rotasMapa.Partida?.Cidade!, this.rotasMapa.Destino?.Cidade!);
    this.directionsService.route(
      requestDS)
      .then((response: any) => {       
        this.directionsRenderer.setOptions({ polylineOptions: { strokeColor: this.corRota } });        
        this.directionsRenderer.setDirections(response);
        this.deletarMarcadores();
        this.listaPontos = !this.rotaAutomatica ? pegarRotasManualModulo(response) : pegarRotasAutomaticasModulo(response, this.googleMap)
        this.rotasParaExport = criarVariavelExportacao(this.rotasImportadas, this.listaPontos);        
        this.atualizarListaPontos(this.listaPontos)
        this.atualizarRotasMapa(this.rotasParaExport)
        this.atualizaImportacaoAtiva(true)
      })
      .catch((e: any) => {       
        if (!environment.production)
          this.messageService.add({ sticky: true, severity: 'warn', summary: 'Erro!', detail: e.message });
      });
  }

  public async buscarRotasPorCepService(rotasMapa: RotasMaps, rotasImportadas: Array<csvRotas>) {
    this.rotasMapa = rotasMapa;
    this.rotasImportadas = rotasImportadas;
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
          return await new Promise((resolve, reject) => {
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
            if (listaDividida.length > 1) {
              this.messageService.add({ sticky: true, severity: 'info', summary: 'Limite de Rotas!', detail: 'Limite de 25 rotas atingido, as demais rotas não seram exibidas!' });
            }
            return this.consultarDirectionsService(placeIdPartida, placeIdDestino, wayptsGeocode);
          }) 
        })
    }
    else { this.messageService.add({ sticky: true, severity: 'warn', summary: 'Erro!', detail: 'Erro na leitura do arquivo' }); }  
  }


  private async consultarDirectionsService(partida: string, destino: string, waypoints: google.maps.DirectionsWaypoint[]) {
    return new Promise((resolve, reject) => {
      this.directionsService.route(
        {
          origin: { placeId: partida },
          destination: { placeId: destino },
          waypoints: waypoints, travelMode: google.maps.TravelMode.DRIVING, optimizeWaypoints: true, region: 'BR'
        })
        .then((response: any) => {
          this.deletarMarcadores();
          this.listaPontos = !this.rotaAutomatica ? pegarRotasManualModulo(response) : pegarRotasAutomaticasModulo(response, this.googleMap)
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
          this.importacaoAtiva = true;
          const objRetorno = {
            listaPontos: this.listaPontos,
            rotasParaExport: this.rotasParaExport
          }
       
          this.atualizarListaPontos(this.listaPontos)
          this.atualizarRotasMapa(this.rotasParaExport)
          this.atualizaImportacaoAtiva(true)
          resolve(objRetorno);
        })
        .catch((e: any) => {          
          this.importacaoAtiva = false;
          this.messageService.add({ sticky: true, severity: 'warn', summary: 'Erro!', detail: e.message });
          const objRetorno = {
            listaPontos: this.listaPontos,
            rotasParaExport: this.rotasParaExport
          }         
          resolve(objRetorno);
        });
    });
   
  }

  //#region <Funções de utilizade - Google API>  
  deletarMarcadores() {
    for (var i = 0; i < this.markerLista.length; i++) {
      this.markerLista[i].setMap(null);
    }
    this.markerLista = [];
  }
  //#endregion


}

