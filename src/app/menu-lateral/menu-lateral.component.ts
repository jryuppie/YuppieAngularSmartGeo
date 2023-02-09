import { Component, OnInit, Input } from '@angular/core';
import { MenuLateralService } from './menu-lateral.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import {APP_VERSION} from './../app.module';
@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css'],
  providers: [MenuLateralService]
})
export class MenuLateralComponent implements OnInit {
  closeResult = '';

  toggle: boolean = false;

  titulo?: string

  valorTesteInput?: string

  temaLuksColor: boolean = false;

  appVersion?: string;

  constructor(private menuLateralService: MenuLateralService,private router: Router) { }

  ngOnInit(): void {
    this.appVersion = APP_VERSION;
    (document.getElementById('sidebar') as HTMLElement).style.setProperty('background-image', 'url(https://www.autoluks.com.br/uploads/1/1/5/6/115643989/background-images/1817667807.jpg)')
    this.temaLuksColor = false;
    // (document.getElementById("mudarTema1") as HTMLElement).addEventListener(
    //   "click", () => {
    //     this.mudarTema()
    //   }
    // );
    // (document.getElementById("mudarTema2") as HTMLElement).addEventListener(
    //   "click", () => {
    //     this.mudarTema()
    //   }
    // );

    //this.menuLateralService?.setTitulo('lateral')!
    
  }
  expandirSidebar(event: Event) {
    console.log(event);
    this.toggle = true;
  }

  mudarActive() {
    this.toggle = !this.toggle;
  }


  mudarTitulo(titulo: string) {
    this.titulo = titulo;
  }

  items!: MenuItem[];
  mudarTema() {
    this.items = [
      { label: 'Usuários', icon: 'pi pi-fw pi-home', routerLink: ["/configuracoes"] }
    ];




    let cor1 = '';
    let cor2 = '';
    let bgSidebar = '';
    if (this.temaLuksColor) {
      cor1 = getComputedStyle(document.documentElement)
        .getPropertyValue('--cor-base-autoluks');
      cor2 = getComputedStyle(document.documentElement)
        .getPropertyValue('--cor-base-complementar-autoluks');
      (document.getElementById('sidebar') as HTMLElement).style.setProperty('background-image', 'url(https://www.autoluks.com.br/uploads/1/1/5/6/115643989/background-images/1817667807.jpg)');
      this.temaLuksColor = false;
    }
    else {
      (document.getElementById('sidebar') as HTMLElement).style.setProperty('background-image', 'url()');
      (document.getElementById('sidebar') as HTMLElement).style.setProperty('background-image', cor1);
      cor1 = getComputedStyle(document.documentElement)
        .getPropertyValue('--cor-base-lukscolor');
      cor2 = getComputedStyle(document.documentElement)
        .getPropertyValue('--cor-base-complementar-lukscolor');
      this.temaLuksColor = true;
    }
    (document.querySelector(':root') as HTMLElement).style.setProperty('--cor-base', cor1);
    (document.querySelector(':root') as HTMLElement).style.setProperty('--cor-base-complementar', cor2);

  }

}


