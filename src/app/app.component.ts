import { Component } from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {
  constructor() { }
  closeResult = '';
  title = 'LuksMove';
  toggle: boolean = false;
  

  expandirSidebar(event: Event){
    this.toggle = true;
  }

  mudarActive(){
    this.toggle = !this.toggle;
  }
}
