import { Component, OnInit, ViewChild } from '@angular/core';
import { BillingService} from '../services/billing.service'


@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css']
})
export class ConfiguracoesComponent implements OnInit {
 
  constructor(private billingService: BillingService) { }
  LigDeslGoogleAPIMaps: boolean = false;
  LigDeslGoogleAPIRotas: boolean = false;
  ngOnInit() {  
    this.LigDeslGoogleAPIMaps = true;
    this.LigDeslGoogleAPIRotas = true;

    (document.getElementById('h1Titulo') as HTMLElement).innerHTML = 'Google API ';

    debugger
    this.billingService.getBillingInfo()
  }
  trocarStatusGoogleAPi(event: Event) {
    
  }

  // 
}