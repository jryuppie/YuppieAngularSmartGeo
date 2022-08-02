import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';


@Component({
  selector: 'app-agendar-rotas',
  templateUrl: './agendar-rotas.component.html',
  styleUrls: ['./agendar-rotas.component.css']
})
export class AgendarRotasComponent implements OnInit {

  constructor() {}

  input1: any;
  input2: any;
  input3: any;
  input4: any;
  input5: any;
  input6: any;
  
  parada2show: boolean = false;
  parada3show: boolean = false;
  parada4show: boolean = false;
  ngOnInit() {
    this.parada2show = false;
    this.parada3show = false;
    this.parada4show= false;

    let loader = new Loader({
      apiKey: 'AIzaSyCbu9PxUAnPqy2W1fyKwLANXFywzDyiDKI',
      libraries: ['places']
    });

    loader.load().then(() => {
      var directionsService = new google.maps.DirectionsService();
      var directionsRenderer = new google.maps.DirectionsRenderer();

      let map = new google.maps.Map(document.getElementById('mapAgendar')!, {
        center: { lat: -23.5489, lng: -46.6388 },
        zoom: 8
      })
      directionsRenderer.setMap(map);

      const onChangeHandler = () => {
        this.calculateAndDisplayRoute(directionsService, directionsRenderer);
      };
      (document.getElementById("enviar") as HTMLElement).addEventListener(
        "click",
        onChangeHandler
      );


     




      
      
      var options = {
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
      
    });

  }
  calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {


    const waypts: google.maps.DirectionsWaypoint[] = [];

    if( (document.getElementById("parada") as HTMLInputElement).value != ''){
      waypts.push({
        location: (document.getElementById("parada") as HTMLInputElement).value,
        stopover: true,
      });
    }
    if( (document.getElementById("parada2") as HTMLInputElement).value != ''){
      waypts.push({
        location: (document.getElementById("parada2") as HTMLInputElement).value,
        stopover: true,
      });
    }
  
    if( (document.getElementById("parada3") as HTMLInputElement).value != ''){
      waypts.push({
        location: (document.getElementById("parada3") as HTMLInputElement).value,
        stopover: true,
      });
    }

    if( (document.getElementById("parada4") as HTMLInputElement).value != ''){
      waypts.push({
        location: (document.getElementById("parada4") as HTMLInputElement).value,
        stopover: true,
      });
    }
    if( (document.getElementById("partida") as HTMLInputElement).value != '' && (document.getElementById("destino") as HTMLInputElement).value != ''){

      directionsService
      .route({
        origin: {
          query: (document.getElementById("partida") as HTMLInputElement).value,
        },
        destination: {
          query: (document.getElementById("destino") as HTMLInputElement).value,
        },
        waypoints: waypts,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints :true,
        provideRouteAlternatives: true
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
    //.catch((e) => window.alert("Directions request failed due to " + status));
    }
    



  }

 
  
  
  adicionarParadaTela(){   
    if(this.parada2show === false){     
      this.parada2show = true; 
      return;     
    }
    
    if(this.parada3show === false){     
      this.parada3show = true; 
      return;     
    }

    if(this.parada4show === false){     
      this.parada4show = true; 
      return;     
    }
  }



}
