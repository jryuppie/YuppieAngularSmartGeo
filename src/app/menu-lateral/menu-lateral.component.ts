import { Component,  OnInit,Input } from '@angular/core';
import { MenuLateralService } from './menu-lateral.service';


@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css'],
  providers:[MenuLateralService]
})
export class MenuLateralComponent implements OnInit {
  closeResult = '';

  toggle: boolean = false;
  
  titulo?: string

  valorTesteInput?: string

  constructor(private menuLateralService: MenuLateralService) { }

  ngOnInit(): void {
    this.menuLateralService?.setTitulo('lateral')!
    console.log(this.menuLateralService)
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

}