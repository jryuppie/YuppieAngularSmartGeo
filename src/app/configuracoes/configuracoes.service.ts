

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Usuario } from '../models/usuario';

@Injectable()
export class ConfiguracoesService {

  constructor(private http: HttpClient) { }

  getUsuariosReduzido() {
    return this.http.get<any>('assets/dataUsuariosTeste.json')
      .toPromise()
      .then(res => <Usuario[]>res.data)
      .then(data => { return data; });
  }

  getUsuariosTeste() {
    return this.http.get<any>('assets/dataUsuariosTeste.json')
      .toPromise()
      .then(res => <Usuario[]>res.data)
      .then(data => { return data; });
  }
  
 
  generateUsuario(): Usuario {
    const Usuario: Usuario = {
      id: this.generateId(),
      nome: "Funcionário",
      funcao: "Desenvolvedor",
      unidade: "São Paulo",
      autorizacao: "SIM"

    };


    return Usuario;
  }

  generateId() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  } 
}