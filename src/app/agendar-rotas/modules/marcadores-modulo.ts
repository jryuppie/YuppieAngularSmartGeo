  //adicioanr marcadores
  export function layoutMarcadores(item: any, location: any, ultimo: boolean, map:any, markerLista: any[]) {

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
      map: map,
      title: item.a,
      animation: google.maps.Animation.DROP
    });
    markerLista.push(marker);

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map: map,
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
  