import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { MenuLateralService } from '../menu-lateral/menu-lateral.service';
import { csvRotas, Localizacao, RotasMaps } from '../models/csvRotas';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-agendar-rotas',
  templateUrl: './agendar-rotas.component.html',
  styleUrls: ['./agendar-rotas.component.css'],
  providers: [MessageService]

})


export class AgendarRotasComponent implements OnInit {
  public destroyed = new Subject<any>();
  valorFileText: undefined;
  constructor(private menuLateralService: MenuLateralService, private http: HttpClient, private messageService: MessageService, private router: Router) { }

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
  importacaoAtiva: boolean = false;
  //#endregion
  //#region <VARIAVEIS DE MANIPULAÇÃO DO MAPA>  
  stepDisplay: any;
  markerLista: any[] = [];
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

  selectedModalCEP: csvRotas = {};
  mostrarModalCEP: boolean = false;
  //#endregion


  apiKey: string = 'AIzaSyDYR45TvExNG498aRNe_C2MS4R0p4EKS4U';//'AIzaSyCbu9PxUAnPqy2W1fyKwLANXFywzDyiDKI',
  corRota: string = '';
  mostrarModalDetalhesRota: boolean = false;
  mostrarSidePanel: boolean = false;
  mostrarMapaSM: boolean = false;

  labelsNumeric = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  rotasParaExport: Array<csvRotas> = new Array<csvRotas>();

  ngOnInit() {

    this.corRota = getComputedStyle(document.documentElement).getPropertyValue('--cor-base');

    //ATRIBUIR TITULO A PAGINA
    (document.getElementById('h1Titulo') as HTMLElement).innerHTML = 'Planejar Rotas';

    //MANIPULAÇÃO DAS VARIAVEIS DE TELA
    this.buscarPorCep = true;
    this.parada2show = false;
    this.parada3show = false;
    this.parada4show = false;


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
      //EXEMPLO DE MARKER FIXO NO MAPA
      // const svgMarker = {
      //   path: "M17.592,8.936l-6.531-6.534c-0.593-0.631-0.751-0.245-0.751,0.056l0.002,2.999L5.427,9.075H2.491c-0.839,0-0.162,0.901-0.311,0.752l3.683,3.678l-3.081,3.108c-0.17,0.171-0.17,0.449,0,0.62c0.169,0.17,0.448,0.17,0.618,0l3.098-3.093l3.675,3.685c-0.099-0.099,0.773,0.474,0.773-0.296v-2.965l3.601-4.872l2.734-0.005C17.73,9.688,18.326,9.669,17.592,8.936 M3.534,9.904h1.906l4.659,4.66v1.906L3.534,9.904z M10.522,13.717L6.287,9.48l4.325-3.124l3.088,3.124L10.522,13.717z M14.335,8.845l-3.177-3.177V3.762l5.083,5.083H14.335z",
      //   fillColor: "green",
      //   fillOpacity: 100,
      //   strokeWeight: 0,
      //   rotation: 15,
      //   scale: 2,
      //   anchor: new google.maps.Point(10, 30),
      // };

      // new google.maps.Marker({
      //   position: this.map.getCenter(),
      //   icon: svgMarker,
      //   map: this.map,
      // });



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

      if (this.rotasImportadas.length > 0) {
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
        this.directionsRenderer.setOptions({ polylineOptions: { strokeColor: this.corRota } });
        this.directionsRenderer.setDirections(response);
        this.pegarParadasResponse(response);
        //this.mostrarParadas(response, markerArray, stepDisplay, map);
        this.isLoading = false;

      })
      .catch((e: any) => {
        this.isLoading = false
        this.messageService.add({ sticky: true, severity: 'warn', summary: 'Erro!', detail: e.message });
      });
  }

  buscarRotasPorCidade(waypts: google.maps.DirectionsWaypoint[]) {
    this.directionsService.route(
      this.atribuirRequestManual(waypts))
      .then((response: any) => {
        this.directionsRenderer.setOptions({ polylineOptions: { strokeColor: this.corRota } });
        this.directionsRenderer.setDirections(response);
        this.pegarParadasResponse(response);
        // this.mostrarParadas(response, markerArray, stepDisplay, map);
        this.isLoading = false;

      })
      .catch((e: any) => {
        this.isLoading = false
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
    let unique = [...new Set(splitRotas)]
    var listaDividida = this.dividirLista(unique, 25)




    if (listaDividida.length > 0) {
      var rotasPromisse: Promise<boolean>[] = []
      await listaDividida[0].forEach((item: any) => {
        rotasPromisse.push(
          new Promise((resolve, reject) => {
            let stringet = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + item + '&key=' + this.apiKey + '&region=BR&language=pt-BR';
            this.http.get<any>(stringet).subscribe(data => {
              if (data.status == 'OK') {
                let cep: string = data.results[0]?.address_components[0].long_name.replace(/[^0-9]/g, '')!;
                let placeID: string = data.results[0]?.place_id;
                if (typeof cep !== 'undefined' && cep && typeof placeID !== 'undefined' && placeID) {
                  let localizacao: Localizacao = new Localizacao();
                  localizacao.CEP = cep;
                  localizacao.PlaceId = placeID;
                  //  console.log(cep + ' - ' + placeID + ' - ' + this.ListaGeocode.length)
                  if (!this.ListaGeocode.some((a) => a.PlaceId === placeID)) { this.ListaGeocode.push(localizacao); }

                  // this.http.get<any>('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + placeID + '&key=' + this.apiKey).subscribe(data => {console.log(data)});
                }
              }
              resolve(true)
              if (data.status == 'ZERO_RESULTS') {
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
        this.pegarParadasResponse(response);
        let labelIndex = 0;

        this.directionsRenderer
        this.directionsRenderer.setOptions({
          polylineOptions: {
            geodesic: true,
            strokeColor: this.corRota,
            strokeOpacity: 1.0,
            strokeWeight: 5,
            clickable: true,
            // icons: [
            //   {
            //      icon: this.labelsNumeric[labelIndex++ % this.labelsNumeric.length],
            //     offset: "100%",

            //   }
            // ]
          }
        });





        // this.mostrarParadas(response, markerArray, stepDisplay, map);

        // this.directionsRenderer.setDirections(response);
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


  dividirLista(itens: any, maximo: any) {
    return itens.reduce((acumulador: any, item: any, indice: any) => {
      const grupo = Math.floor(indice / maximo);
      acumulador[grupo] = [...(acumulador[grupo] || []), item];
      return acumulador;
    }, []);
  };

  atribuirRequestLatLong(waypts: google.maps.DirectionsWaypoint[]) {
    let unique = [...new Set(waypts)]
    let listaDividida = this.dividirLista(unique, 22)
    let lat = parseFloat(this.rotasMapa.Partida?.Latitude!)
    let lng = parseFloat(this.rotasMapa.Partida?.Longitude!)
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

  pegarParadasResponse(response: any) {
    this.rotasParaExport = [];
    let labelsNumeric = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
    let alfab = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let indexAlfa = 0
    const Legs = response!.routes[0]!.legs!;
    this.listaPontos = [];
    if (!this.rotaManualVisualizar) {
      for (let index = 0; index < Legs.length; index++) {
        if (index == 0) {
          const cep: string = Legs[index].start_address;
          const distancia: string = '';//Legs[index].distance.text;
          const duracao: string = '';//Legs[index].duration.text;
          const posicao = labelsNumeric[indexAlfa]
          let item: any = { a: cep, b: distancia, c: duracao, d: posicao }
          this.listaPontos.push(item);
          indexAlfa++
        }

        const cep: string = Legs[index].end_address;
        const distancia: string = Legs[index].distance.text;
        const duracao: string = Legs[index].duration.text;
        const posicao = labelsNumeric[indexAlfa]
        let item: any = { a: cep, b: distancia, c: duracao, d: posicao }
        this.listaPontos.push(item);
        indexAlfa++
      }

    }
    else {
      this.deleteMarkers();
      for (let index = 0; index < Legs.length; index++) {

        // console.log(Legs[index])
        if (index == 0) {
          const cep: string = Legs[index].start_address.split(',')[Legs[index].start_address.split(',').length === 4 ? 2 : 2];
          const endereco: string = Legs[index].start_address.split(',')[Legs[index].start_address.split(',').length === 4 ? 0 : 2] + ' - Início';
          const dr: string = '';//Legs[index].duration.text;
          const letra = labelsNumeric[indexAlfa]
          let item: any = { a: cep, b: endereco, c: dr, d: letra }
          this.listaPontos.push(item);
          //this.layoutMarcadores(item, Legs[index].start_location,false);
          indexAlfa++
        }
        let cep: string = '';
        let endereco: string = '';
        let duracao: string = ';'
        switch (Legs[index].end_address.split(',').length) {
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
        const letra = labelsNumeric[indexAlfa]
        let item: any = { a: cep, b: endereco, c: duracao, d: letra }
        this.listaPontos.push(item);
        this.layoutMarcadores(item, Legs[index].end_location, index == Legs.length - 1 ? true : false);
        indexAlfa++
      }
      // console.log(this.listaPontos);
    }
    this.criarVariavelExportacao();
    this.directionsRenderer.setDirections(response);

  }

  //montar arquivo de export
  criarVariavelExportacao() {
    //CRIAR A LOGICA PARA REDUZIR A LISTA APENAS A LSITA DE PONTOS CAPTURADOS
    for (let index = 0; index < this.rotasImportadas.length; index++) {
      const element = this.rotasImportadas[index];

      var contadorPD = 1;
      for (let index = 0; index < this.listaPontos.length; index++) {
       
        const ponto = this.listaPontos[index];
        let cepTratado = ponto.a.replace(/[^0-9]/g, '')!
        if (cepTratado === element.CEP) {
         
          if (element.PatridaDestino === 'SIM' && contadorPD < 2) {
            contadorPD++
            element.DataHoraConsulta = this.gerarDataHoraString();
            element.SequenciaOtimizada = '1'
            this.rotasParaExport.push(element);
           break;
          }
          else {
            element.DataHoraConsulta = this.gerarDataHoraString();
            element.SequenciaOtimizada = ponto.d;
            this.rotasParaExport.push(element);
          }
         
        }

        if(index == this.listaPontos.length){
          element.DataHoraConsulta = this.gerarDataHoraString();
          element.SequenciaOtimizada = (Number(ponto.d)+1).toString(); 
          this.rotasParaExport.push(this.rotasImportadas[0]);

        }
      }
    }
    console.log(this.rotasParaExport);
    // this.rotasImportadas.forEach(linha => {
    //   linha.Ordem = this.listaPontos.find(function (item: any) {
    //     let cepTratado = item.a.replace(/[^0-9]/g, '')!
    //     return  cepTratado === linha.CEP;
    //   })?.d;
    //   linha.DataHoraConsulta = this.gerarDataHoraString() ;
    // });

    // this.rotasParaExport = this.rotasParaExport.sort((a, b) => (a.OrdemOriginal! < b.OrdemOriginal! ? -1 : 1));
  }

  exportarRota() {

    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rotasParaExport, { header: ['SequenciaOriginal', 'NomeFuncionario', 'PatridaDestino', 'Latitude', 'Longitude', 'Cidade', 'Estado', 'CEP', 'SequenciaOtimizada', 'DataHoraConsulta'], skipHeader: false });
    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rotas');

    let nomeArquivo = 'LuksMove_Rotas_SP1103_' + '_' + this.gerarDataHoraString() + '.csv'
    XLSX.writeFile(wb, nomeArquivo);
  }


  gerarDataHoraString() {
    let dataAtual = new Date()
    let datahora = dataAtual.toLocaleDateString();
    let horario = dataAtual.getHours() + ":" + dataAtual.getMinutes() + ":" + dataAtual.getSeconds();
    return datahora + ' ' + horario
  }

  //adicioanr marcadores
  layoutMarcadores(item: any, location: any, ultimo: boolean) {

    let textLabel = ultimo == true ? "1 - " + (item.d) : "" + (item.d)
    let hrefGoogle = "https://www.google.com.br/maps/search/" + item.a.replace(/[^0-9]/g, '')
    const contentString = `
 
    <div class="card border-round ">
        <img class="border-round" src="assets/images/imagemRota3.jpg" style="height:150px">     
        <div  style="padding: 16px 8px 8px 8px; margin-top:1px;" class="border-round-3xl">     
          <span class="font-semibold p-1 text-xs border-1 border-solid border-red-500 text-red-600 border-round-3xl ml-3 ">`+ item.a + `</span>
          <span class="font-semibold p-1 text-xs border-1 border-solid border-red-500 text-red-600 border-round-3xl ml-3 ">`+ item.c + `</span> 
          <span class="font-semibold p-1 text-xs border-1 border-solid border-red-500 text-red-600 border-round-3xl ml-3 ">`+ textLabel + `</span>     
          <div class="font-semibold text-xl mt-2 p-3">`+ item.b + `</div>         
          <a href="`+ hrefGoogle + `" target="_blank"><button  style="cursor: pointer; display: block; margin: 0 auto; border: 12px 24px; border-radius: 50px; border: none;  font-weight: 600;  color: #0077ff;  background-color: #e0efff;" >Google Maps</button></a>
        </div>
      </div>
   
  `

    textLabel = ultimo == true ? "1-" + (item.d) : "" + (item.d)
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });
    const marker = new google.maps.Marker({
      position: location,
      label: { text: textLabel, color: "white" },
      map: this.map,
      title: item.a,
      animation: google.maps.Animation.DROP
    });
    this.markerLista.push(marker);

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map: this.map,
        shouldFocus: false,
      });
    });
    infowindow.addListener("domready", () => {


      const nodeList1 = document.querySelectorAll(".gm-style-iw-d");
      for (let i = 0; i < nodeList1.length; i++) {
        (nodeList1[i] as HTMLElement).style['overflow'] = 'unset';
      }
      const nodeList2 = document.querySelectorAll(".gm-style-iw");
      for (let i = 0; i < nodeList2.length; i++) {
        (nodeList2[i] as HTMLElement).style['padding'] = '0px';
        (nodeList2[i] as HTMLElement).style['maxHeight'] = '320px';
        (nodeList2[i] as HTMLElement).style['maxWidth'] = '260px';
      }
      const nodeListC = document.querySelectorAll(".gm-style-iw-c");
      for (let i = 0; i < nodeList1.length; i++) {
        (nodeListC[i] as HTMLElement).classList.add('shadow-8');
      }
      // setTimeout(()=> {
      //   this.loadMarker = false;
      // }, 1000);
    });

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
    let arrayPartida = this.rotasImportadas.filter(r => r.PatridaDestino === 'SIM');

    if (arrayPartida != null && arrayPartida != undefined && arrayPartida.length > 0) {
      this.rotasMapa.Partida = arrayPartida[0];
      this.rotasMapa.Destino = arrayPartida[0];
    }

    const paradasImportadas: Array<csvRotas> = this.rotasImportadas.filter(r => r.PatridaDestino === 'NAO');
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


  clearMarkers() {
    for (var i = 0; i < this.markerLista.length; i++) {
      this.markerLista[i].setMap(null);
    }
  }


  deleteMarkers() {

    this.clearMarkers();
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

    try {
      let separador = ';'
      let csv: any = reader.result;
      let allTextLines = [];
      allTextLines = csv.split(/\r|\n|\r/);

      //header tabela
      let headers = allTextLines[0].split(separador);
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
          let campos = allTextLines[i].split(separador)
          let rotaRow: csvRotas = {
            SequenciaOriginal: campos[0],
            NomeFuncionario: campos[1],
            // PatridaDestino: campos[2] === "SIM" ? true : false,
            PatridaDestino: campos[2] === "SIM" ? 'SIM' : 'NAO',
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
    catch (e) {
      this.messageService.add({ sticky: true, severity: 'error', summary: 'Erro de leitura', detail: 'Erro na leiturado arquivo, verifique o modelo de importação' });
    }
  }
  //#endregion



  AbrirModalCEP(cep: string) {
    let cepTratado = cep.replace(/[^0-9]/g, '')!

    this.selectedModalCEP = this.rotasMapa.Paradas?.find(f => f.CEP == cepTratado)!


    this.mostrarModalCEP = true;
  }

}


