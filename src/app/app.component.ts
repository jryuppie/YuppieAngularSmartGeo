import { Component } from '@angular/core';
import {NgbOffcanvas, OffcanvasDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {
  constructor(private offcanvasService: NgbOffcanvas) { }
  closeResult = '';
  title = 'YuppieAngularSmartgeo';
  toggle: boolean = false;
  

  expandirSidebar(event: Event){
    console.log(event);
    
    this.toggle = true;
  }

  mudarActive(){
    this.toggle = !this.toggle;
  }
}
