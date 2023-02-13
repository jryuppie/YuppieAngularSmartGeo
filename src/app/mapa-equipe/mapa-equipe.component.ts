import { Component, OnInit,Input  } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { MenuLateralService } from '../menu-lateral/menu-lateral.service';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-mapa-equipe',
  templateUrl: './mapa-equipe.component.html',
  styleUrls: ['./mapa-equipe.component.css'],
  providers: [MenuLateralService, MessageService],

})

export class MapaEquipeComponent implements OnInit {

  
  
  @Input('valorTesteInput') valorTesteInput?: string;
  constructor(private menuLateralService: MenuLateralService, public messageService: MessageService) { 

   
  }

  apiKey: string = environment.apikey;
  map: any
  items: any;

  selectedLocation: any;
  selectedFuncionario: [string, number, number, number] = ["", 0, 0, 0];
  closeResult = '';
  input1: any;
  input2: any;
  input3: any;
  labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  locations = [
    { lat: -23.5062, lng: -47.4559 },
    { lat: -23.9618, lng: -46.3322 },
    { lat: -22.5645, lng: -47.4004 },
    { lat: -23.6687, lng: -46.4614 },
    { lat: -23.6666, lng: -46.5322 },
    { lat: -21.1767, lng: -47.8208 },
    { lat: -23.1865, lng: -46.8845 }
  ];

  MarkerHead = '';
  MarkerContent = '';
  mostrarModalFuncionario: boolean = false;



  locationsComplex: [string, number, number, number][] = [
    ["Funcionario 1", -23.5062, -47.4559, 4],
    ["Funcionario 2", -23.9618, -46.3322, 5],
    ["Funcionario 3", -22.5645, -47.4004, 3],
    ["Funcionario 4", -23.6687, -46.4614, 2],
    ["Funcionario 5", -21.1767, -47.8208, 1],
  ];






  ngOnInit() {   
    (document.getElementById('h1Titulo') as HTMLElement).innerHTML =  'Mapa Equipe';
    
    let loader = new Loader({
      apiKey: this.apiKey,
      libraries: ['places','geometry'],
      region: 'BR',
      language: 'pt-BR',
    });

    loader.load().then(() => {
      var directionsService = new google.maps.DirectionsService();
      var directionsRenderer = new google.maps.DirectionsRenderer();
      this.map = new google.maps.Map(document.getElementById('mapEquipe')!, {
        mapId: '178c0b225e053393',
        center: { lat: -23.5489, lng: -46.6388 },
        zoom: 8,
        streetViewControl: false
      })
      console.log(this.map);
      directionsRenderer.setMap( this.map);
      this.setMarkers( this.map);
    

      
      //FIM DE MANIPUALÇÃO DOS CAMPOS PARA CONSULTA MANUAL


      //REMOVER INFORMAÇÕES DO GOOGLE MAPS DA TELA
      setTimeout(function () {
        (document.querySelector("#mapEquipe > div > div > div:nth-child(17) > div") as HTMLElement).style['display'] = 'none';
        (document.querySelector("#mapEquipe > div > div > div:nth-child(15) > div") as HTMLElement).style['display'] = 'none';
        (document.querySelector("#mapEquipe > div > div > div:nth-child(5) > div") as HTMLElement).style['display'] = 'none';

      }, 4000);
    });


  }
  showDialog() {
    this.mostrarModalFuncionario = true;
  }
  mostrarFuncionario(id: number) {
    this.selectedFuncionario = this.locationsComplex.find(f => f[3] == id)!;
    this.mostrarModalFuncionario = true;
  }

  setMarkers(map: google.maps.Map) {


    const infowindow = new google.maps.InfoWindow().setContent(' <a onClick="showDialog()">Jonathan Rossato</a>');

    for (let i = 0; i < this.locationsComplex.length; i++) {
      const location = this.locationsComplex[i];

      let cMarker = new google.maps.Marker({
        position: { lat: location[1], lng: location[2] },
        map,

        title: location[0],
        zIndex: location[3],
      });

      cMarker.addListener("click", () => {
        var infowindow = new google.maps.InfoWindow({
          content: location[0],

        });
        infowindow.open({
          anchor: cMarker,
          map,
          shouldFocus: false,
        });
      });

      window.addEventListener
    }

  }


}




