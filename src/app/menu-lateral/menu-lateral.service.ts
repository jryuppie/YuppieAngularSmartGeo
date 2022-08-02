import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuLateralService {
  mostrarModalFuncionario: boolean = false;
  constructor() { }

  showDialog(){
    this.mostrarModalFuncionario = true;
 }
}
