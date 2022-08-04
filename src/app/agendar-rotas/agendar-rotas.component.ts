import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

import { MenuLateralService } from '../menu-lateral/menu-lateral.service';
import { csvRotas, ListaRotasCSV, RotasMaps } from '../models/csvRotas';


@Component({
  selector: 'app-agendar-rotas',
  templateUrl: './agendar-rotas.component.html',
  styleUrls: ['./agendar-rotas.component.css']
})
export class AgendarRotasComponent implements OnInit {
  constructor(private menuLateralService: MenuLateralService, private http: HttpClient) {}
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



 fileName : string = '';

  map: any;
  directionsService: any;
  directionsRenderer: any;
  stepDisplay: any;
  markerArray: any[] = [];
  public rotasMapa: RotasMaps = new RotasMaps();
  public rotasImportadas: Array<csvRotas> = new Array<csvRotas>();
    

  //  geocoder: any = new google.maps.Geocoder();
  //  serviceMatrix: any = new google.maps.DistanceMatrixService();

  ngOnInit() {
    this.parada2show = false;
    this.parada3show = false;
    this.parada4show = false;

    let loader = new Loader({
      apiKey: 'AIzaSyCbu9PxUAnPqy2W1fyKwLANXFywzDyiDKI',
      libraries: ['places'],
      region: 'BR',
      language: 'pt-BR',
    });
    
    loader.load().then(() => {
      debugger;
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.stepDisplay = new google.maps.InfoWindow();
      this.markerArray = [new google.maps.Marker];

      // mappId 57f03a0f789e26df
      this.map = new google.maps.Map(document.getElementById('mapAgendar')!, {
        mapId: '178c0b225e053393', 
        center: { lat: -23.5489, lng: -46.6388 },
        zoom: 8,
        streetViewControl:false
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


      setTimeout(function() {
        (document.querySelector("#mapAgendar > div > div > div:nth-child(17) > div") as HTMLElement).style['display'] = 'none';
        (document.querySelector("#mapAgendar > div > div > div:nth-child(15) > div") as HTMLElement).style['display'] = 'none';
        (document.querySelector("#mapAgendar > div > div > div:nth-child(5) > div") as HTMLElement).style['display'] = 'none';
        
    }, 2000);
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
        partida = (document.getElementById("partida") as HTMLInputElement).value;
      }
      if ((document.getElementById("destino") as HTMLInputElement).value != '') {
        destino = (document.getElementById("destino") as HTMLInputElement).value;
      }

    } else {
      if (this.rotasImportadas != []) {

        let arrayPartida = this.rotasImportadas.filter(r => r.PatridaDestino === true);

        if (arrayPartida != null && arrayPartida != undefined && arrayPartida.length > 0) {
          this.rotasMapa.Partida = arrayPartida[0];
          this.rotasMapa.Destino = arrayPartida[0];
        }

        const paradasImportadas = this.rotasImportadas.filter(r => r.PatridaDestino === false);

        paradasImportadas.forEach((item) => {
          this.rotasMapa.Paradas?.push(item);
        });
        console.log(this.rotasMapa.Paradas);


        partida = this.rotasMapa.Partida?.Latitude! + this.rotasMapa.Partida?.Longitude! ;
        destino = this.rotasMapa.Partida?.Latitude! +  this.rotasMapa.Partida?.Longitude!;

        paradasImportadas.forEach(element => {
          let lat:number = parseFloat(element.Latitude!);
          let lng:number = parseFloat(element.Longitude!);

          waypts.push({
            location:new google.maps.LatLng(lat, lng) ,
            stopover: true,
          });
        });
      }
    }

     var origin = new google.maps.LatLng(parseFloat(this.rotasMapa.Partida?.Latitude!), parseFloat(this.rotasMapa.Partida?.Longitude!));
    // var destination = new google.maps.LatLng(37.7683909618184, -122.51089453697205);

console.log(origin);


    if (partida != '' && destino != '') {
      this.directionsService.route(
        {
          origin: {
             lat: parseFloat(this.rotasMapa.Partida?.Latitude!)+ 0.00050, lng: parseFloat(this.rotasMapa.Partida?.Longitude!)         
          },
          destination: {
            lat: parseFloat(this.rotasMapa.Partida?.Latitude!) , lng: parseFloat(this.rotasMapa.Partida?.Longitude!) 
          },
           waypoints: waypts,
          travelMode: google.maps.TravelMode.DRIVING,
           optimizeWaypoints: true,
          
          region: 'BR',

        })
        .then((response: any) => {
          var label= { color: '#333', fontWeight: 'bold', fontSize: '16px', text:'teste' }; 
          this.directionsRenderer.setOptions({polylineOptions: {strokeColor: 'yellow' }});
          this.directionsRenderer.setOptions({MarkerOptions: {label: label }});
          
          
          this.directionsRenderer.setDirections(response);
          
          // this.showSteps(response, markerArray, stepDisplay, map);
          this.isLoading = false;
          
        })
        .catch((e: any) => {this.isLoading = false
        
        console.log(e);
        });
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





  onFileSelected(event: Event) {
    debugger;
    this.isUpload = true;
    const result = (event.target as HTMLInputElement).files;

    if (result != null) {
      const file: File = result[0];
      if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("rotas", file);
        console.log(formData)

        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.leituraArquivoRotas(fileReader)
        }
        fileReader.readAsText(file);
      }
    }
    this.isUpload = false;
  }

  //array varibales to store csv data
  lines = []; //for headings
  linesR = []; // for rows

  leituraArquivoRotas(reader: FileReader) {
    debugger;
    let csv: any = reader.result;
    let allTextLines = [];
    allTextLines = csv.split(/\r|\n|\r/);

    //Table Headings
    let headers = allTextLines[0].split(';');
    let data = headers;
    let tarr = [];
    for (let j = 0; j < headers.length; j++) {
      tarr.push(data[j]);
    }
    //Pusd headings to array variable
    // this.lines.push(tarr);


    // Table Rows
    let tarrR = [];

    let arrl = allTextLines.length;
    let rows = [];
    for (let i = 1; i < arrl; i++) {
      if (allTextLines[i] != '') {
        let campos = allTextLines[i].split(',')
        let rotaRow: csvRotas = {
          IdFuncionario: campos[0],
          NomeFuncionario: campos[1],
          PatridaDestino: campos[2] === "SIM"? true: false,
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


}
