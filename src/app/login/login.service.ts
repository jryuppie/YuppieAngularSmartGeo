import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { UsuarioDTO } from '../models/usuarioDTO';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }
  private loggedIn: boolean = false;
  isLoggedIn(): Observable<boolean> {
    debugger;
    if (this.loggedIn) {
      // Verifica se o estado do login já está em memória
      return of(this.loggedIn);
    } else {
      // Caso contrário, verifica se há um usuário logado armazenado no localStorage
      const status =  localStorage.getItem('ativo');
      if (status === "true")this.loggedIn = true;  
      return of(this.loggedIn);
    }
  }

  realizarLoginLuksMove(documento: string, senha: string): Observable<UsuarioDTO> {

    const url = `${environment.WebAPI}/api/Login`;
    // Adicione os parâmetros à URL
    const params = {
      documento: documento,
      senha: senha
    };    
    return this.http.get(url, { params: params }).pipe(
      map((response: any) => {
        debugger
        this.loggedIn = true;
        return response as string; // Conversão de tipo explícita
      }),
      catchError((error: any) => {
        this.loggedIn = false;
        return of(error);
      })
    );
  }
}






