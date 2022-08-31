import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css']
})
export class ConfiguracoesComponent implements OnInit {
 
  constructor() { }
  LigDeslGoogleAPIMaps: boolean = false;
  LigDeslGoogleAPIRotas: boolean = false;
  ngOnInit() {  
    this.LigDeslGoogleAPIMaps = true;
    this.LigDeslGoogleAPIRotas = true;

    (document.getElementById('h1Titulo') as HTMLElement).innerHTML = 'Google API ';
  }
  trocarStatusGoogleAPi(event: Event) {
    
  }

  // 
}