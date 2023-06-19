import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuLateralService } from '../menu-lateral/menu-lateral.service';
import { csvRotas, RotasMaps } from '../models/csvRotas';
import { responseQualp, ConsumoMedio } from '../models/responseQualp';
import { Papa } from 'ngx-papaparse';
import { exportarRotaModule } from './modules/exportacao-modulo'
import { importarArquivoSelecionado } from './modules/importacao-modulo'
import { capturarWaypointsCSV, capturarInputsWaypoints } from './modules/waypoints-modulo'
import { GoogleService } from './service/google.service';
import {NgForm} from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-agendar-rotas',
  templateUrl: './agendar-rotas.component.html',
  styleUrls: ['./agendar-rotas.component.css'],
  providers: [MessageService, GoogleService]
})


export class AgendarRotasComponent implements OnInit {  
  valorFileText: undefined;
    consumo: number = 0
    preco: number = 0
   

  constructor(private menuLateralService: MenuLateralService, private http: HttpClient, private messageService: MessageService, private router: Router, private papa: Papa, private googleService: GoogleService) { }

  //#region <VARIAVEIS DE EXIBIÇÃO/TELA>  
  showSpinnerCustoRota: boolean = true;
  isUpload: boolean = false;
  listaPontos: any;
  rotaAutomatica: boolean = true;
  importacaoAtiva: boolean = false;
  mostrarSidePanel: boolean = false;
  value2: any = 85;
  //#endregion
  //#region <VARIAVEIS DE MANIPULAÇÃO DO MAPA>   
  markerLista: any[] = [];
  rotasMapa: RotasMaps = new RotasMaps();
  rotasImportadas: Array<csvRotas> = new Array<csvRotas>();
  buscarPorCep: boolean = true;
  selectedModalCEP: csvRotas = {};
  mostrarModalCEP: boolean = false;
  corRota: string = '';
 
  parsedData: any;
  rotasParaExport: Array<csvRotas> = new Array<csvRotas>();
  custoRota: responseQualp = new responseQualp();
  consumoMedio: ConsumoMedio = new ConsumoMedio();
  //#endregion


  ngOnInit() {
    this.importarSubjects()
    this.atribuirTitulo();
    this.atribuirCorLayout();
    
    //INICIALIZAÇÃO DO SERVICO DO GOOGLE MAPS API
    this.googleService.carregarGoogleMaps()
  }

  //#region <**** Função para importar os Subjects (objetos que seram atualizados no Service e Componente simultanemente) ****>  
  importarSubjects(){
    this.googleService.listaPontos$.subscribe(listaPontos => {
      this.listaPontos = listaPontos;
    });

    this.googleService.rotasParaExport$.subscribe(rotasMapa => {
      this.rotasParaExport = rotasMapa;
    });

    this.googleService.importacaoAtiva$.subscribe(importacaoAtiva => {
      this.importacaoAtiva = importacaoAtiva;
    });
    
    this.googleService.custoRota$.subscribe(custoRota => {
      this.showSpinnerCustoRota = false;
      this.custoRota = custoRota;
    });

    this.googleService.consumoMedio$.subscribe(consumoMedio => {
      this.consumoMedio = consumoMedio;      
    });
  }
   //#endregion 

  //#region <**** Função principal para consulta de rotas ****>  
  async calcularExibirRotas(csv: boolean = false) {
    this.showSpinnerCustoRota = true;
    this.consumoMedio.preco = this.preco;
    this.consumoMedio.consumo = this.consumo;
    let BuscarPorGeocode = false //valor referente a consulta por latitude e longitude, no momento o mesmo está desativado.  
    const captura = csv ? capturarWaypointsCSV(this.rotasImportadas) : capturarInputsWaypoints();
    this.rotasMapa = captura.rotasMapa;

    //CSV - LATITUDE - LONGITUDE    
    if (!this.buscarPorCep && this.rotaAutomatica && this.rotasImportadas.length > 0 && this.rotasMapa.Destino && this.rotasMapa.Partida)
      this.googleService.buscarRotasPorCidadeOuGeocodeService(BuscarPorGeocode, captura.waypts)

    //CSV - CEP    
    if (this.buscarPorCep && this.rotaAutomatica && this.rotasMapa.Destino && this.rotasMapa.Partida) {     
      await this.googleService.buscarRotasPorCepService(this.rotasMapa, this.rotasImportadas, this.consumoMedio);    
    }
  }
  //#endregion

  //#region <Funções de utilizade Tela>
  atribuirTitulo() {
    //ATRIBUIR TITULO A PAGINA
    (document.getElementById('h1Titulo') as HTMLElement).innerHTML = 'Planejar Rotas';
  }

  atribuirCorLayout() {
    this.corRota = getComputedStyle(document.documentElement).getPropertyValue('--cor-base');
  }

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
  AbrirModalCEP(cep: string) {
    let cepTratado = cep.replace(/[^0-9]/g, '')!
    this.selectedModalCEP = this.rotasMapa.Paradas?.find(f => f.CEP == cepTratado)!
    this.mostrarModalCEP = true;
  }  

  //#endregion

  //#region <Funções de exportação para CSV - Importada do modulo de exportação>
  exportarRota() {
    exportarRotaModule(this.rotasParaExport)
  }
  //#endregion

  //#region <Funções de importação de Arquivo - Importada do modulo de importação>
  async arquivoSelecionado(event: Event) {    
    let retornoImportacao = await importarArquivoSelecionado(event, this.parsedData, this.papa);
    if (retornoImportacao.exibirRotas) {
      this.rotasMapa = retornoImportacao.rotasMapa
      this.rotasImportadas = retornoImportacao.rotasImportadas
      this.calcularExibirRotas(true)
    }
    
  }
  //#endregion 



  


}


