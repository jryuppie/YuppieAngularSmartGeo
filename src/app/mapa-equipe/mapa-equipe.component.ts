import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from "@googlemaps/markerclusterer";


@Component({
  selector: 'app-mapa-equipe',
  templateUrl: './mapa-equipe.component.html',
  styleUrls: ['./mapa-equipe.component.css']
})
export class MapaEquipeComponent implements OnInit {

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

  MarkerHead = '';
  MarkerContent = '';

  contentString =
   '<h3>Jonathan Rossato</h3>'


  locationsComplex: [string, number, number, number][] = [
    ["Cidade 1", -23.5062, -47.4559, 4],
    ["Cidade 2", -23.9618, -46.3322, 5],
    ["Cidade 3", -22.5645, -47.4004, 3],
    ["Cidade 4", -23.6687, -46.4614, 2],
    ["Cidade 5", -21.1767, -47.8208, 1],
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
      this.setMarkers(map);
    });

  }
  


  setMarkers(map: google.maps.Map) {



    

  const infowindow = new google.maps.InfoWindow({
    content: this.contentString,
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




