import { Component, OnInit } from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {
  closeResult = '';
 
  toggle: boolean = false;
  titulo = '';
  
  constructor() { }

  ngOnInit(): void {
  }
  expandirSidebar(event: Event){
    console.log(event);
    
    this.toggle = true;
  }

  mudarActive(){
    this.toggle = !this.toggle;
  }
}