import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

 
export class MenuLateralService {


  
  constructor() { }
   static valorTitulo?:string;
   static mapStatic?: google.maps.Map;

 setTitulo(titulo:string){
  MenuLateralService.valorTitulo = titulo;
 }
 getTitulo(){
  return MenuLateralService.valorTitulo ;
 }


 setMap(map:google.maps.Map){
  MenuLateralService.mapStatic = map;
 }
 getMap(){
  return MenuLateralService.mapStatic ;
 }
}



