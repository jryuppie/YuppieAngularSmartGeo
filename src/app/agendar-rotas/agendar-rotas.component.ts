import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from "@googlemaps/markerclusterer";

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
   
  ngOnInit() {
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

      this.input1 = document.getElementById("inicio");
      if (this.input1 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(this.input1, options);
      }

      this.input2 = document.getElementById("fim");
      if (this.input2 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(this.input2, options);
      }
      this.input3 = document.getElementById("parada1");
      if (this.input3 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(this.input3, options);
      }

      this.input4 = document.getElementById("parada2");
      if (this.input4 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(this.input4, options);
      }
      
    });

  }
  calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {

    const waypts: google.maps.DirectionsWaypoint[] = [];
    waypts.push({
      location: (document.getElementById("parada1") as HTMLInputElement).value,
      stopover: true,
    });
    waypts.push({
      location: (document.getElementById("parada2") as HTMLInputElement).value,
      stopover: true,
    });


    directionsService
      .route({
        origin: {
          query: (document.getElementById("inicio") as HTMLInputElement).value,
        },
        destination: {
          query: (document.getElementById("fim") as HTMLInputElement).value,
        },
        waypoints: waypts,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
    //.catch((e) => window.alert("Directions request failed due to " + status));
  }


  setMarkers(map: google.maps.Map) {





  }






}
