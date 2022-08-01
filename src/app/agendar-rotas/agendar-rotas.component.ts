import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from "@googlemaps/markerclusterer";

@Component({
  selector: 'app-agendar-rotas',
  templateUrl: './agendar-rotas.component.html',
  styleUrls: ['./agendar-rotas.component.css']
})
export class AgendarRotasComponent implements OnInit {

  constructor() { }
  closeResult = '';
  input1: any;
  input2: any;
  input3: any;
  labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  locations = [
    { lat: -23.5062, lng: -47.4559 },
    { lat: -23.9618, lng: -46.3322 },
    { lat: -22.5645, lng: -47.4004 },
    { lat: -23.6687, lng:  -46.4614 },
    { lat:-23.6687, lng: -46.4614 },	
    { lat: -23.6666, lng: -46.5322 },
    { lat: -21.1767, lng: -47.8208 },
    { lat: -23.1865, lng: -46.8845 }
  ];


  locationsComplex: [string, number, number, number][] = [
    ["Bondi Beach", -23.5062, -47.4559, 4],
    ["Coogee Beach", -23.9618, -46.3322, 5],
    ["Cronulla Beach", -22.5645, -47.4004, 3],
    ["Manly Beach", -23.6687, -46.4614, 2],
    ["Maroubra Beach", -21.1767, -47.8208, 1],
  ];
  ngOnInit() {
    let loader = new Loader({
      apiKey: 'AIzaSyCbu9PxUAnPqy2W1fyKwLANXFywzDyiDKI',
      libraries: ['places']
    });

    loader.load().then(() => {
      var directionsService = new google.maps.DirectionsService();
      var directionsRenderer = new google.maps.DirectionsRenderer();


      let map = new google.maps.Map(document.getElementById('map')!, {
        
        center: { lat: -23.5489, lng: -46.6388 },
        zoom: 8
      })
      directionsRenderer.setMap(map);

      const onChangeHandler = () => {
        this.calculateAndDisplayRoute(directionsService, directionsRenderer);
      };
      // (document.getElementById("enviar") as HTMLElement).addEventListener(
      //   "click",
      //   onChangeHandler
      // );


      this.setMarkers(map);



    
//INICIO - MAKER SIMPLES
      // const infoWindow = new google.maps.InfoWindow({
      //   content: "",
      //   disableAutoPan: true,
      // });
    
      // let markers = this.locations.map((position, i) => {    
      //   const label = this.labels[i % this.labels.length];
      //   const marker = new google.maps.Marker({
      //     position,
      //     label,
      //   });

      //   marker.addListener("click", () => {
      //     infoWindow.setContent(label);
      //     infoWindow.open(map, marker);
      //   });
    
      //   return marker;
      // });
      // new MarkerClusterer({ markers, map });
      //FIM - MAKER SIMPLES
      //INICIO - PLACES API
      // var options = {
      //   types: ['(cities)']
      // }

      // this.input1 = document.getElementById("start");
      // if (this.input1 !== null) {
      //   var autocomplete1 = new google.maps.places.Autocomplete(this.input1, options);
      // }


      // this.input2 = document.getElementById("end");
      // if (this.input2 !== null) {
      //   var autocomplete1 = new google.maps.places.Autocomplete(this.input2, options);
      // }
      // this.input3 = document.getElementById("waypoint");
      // if (this.input3 !== null) {
      //   var autocomplete1 = new google.maps.places.Autocomplete(this.input3, options);
      // }
      //FIM BUSCA POR CIDADES TELA
    });

  }
  calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {

    const waypts: google.maps.DirectionsWaypoint[] = [];
  waypts.push({
    location: (document.getElementById("waypoint") as HTMLInputElement).value,
    stopover: true,
  });


    directionsService
      .route({
        origin: {
          query: (document.getElementById("start") as HTMLInputElement).value,
        },
        destination: {
          query: (document.getElementById("end") as HTMLInputElement).value,
        },
        waypoints:waypts,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      //.catch((e) => window.alert("Directions request failed due to " + status));
  }


  setMarkers(map: google.maps.Map) {



    const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    '<div id="bodyContent">' +
    "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
    "sandstone rock formation in the southern part of the " +
    "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
    "south west of the nearest large town, Alice Springs; 450&#160;km " +
    "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
    "features of the Uluru - Kata Tjuta National Park. Uluru is " +
    "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
    "Aboriginal people of the area. It has many springs, waterholes, " +
    "rock caves and ancient paintings. Uluru is listed as a World " +
    "Heritage Site.</p>" +
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
    "(last visited June 22, 2009).</p>" +
    "</div>" +
    "</div>";

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });


    // Adds markers to the map.
  
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
  
    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.
    const image = {
      url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: "poly",
    };
  
    for (let i = 0; i < this.locationsComplex.length; i++) {
      const location = this.locationsComplex[i];
  
      let cMarker = new google.maps.Marker({
        position: { lat: location[1], lng: location[2] },
        map,
        icon: image,
        shape: shape,
        title: location[0],
        zIndex: location[3],
      });

      cMarker.addListener("click", () => {
        infowindow.open({
          anchor: cMarker,
          map,
          shouldFocus: false,
        });
      });
    }

   
  }
  



  

}
