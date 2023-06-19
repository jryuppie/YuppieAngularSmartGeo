import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap ,map} from 'rxjs/operators';
import { LoginService } from '../login/login.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService,private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    debugger
    return this.loginService.isLoggedIn().pipe(     
      map(isLoggedIn => isLoggedIn)
    );
  }
  
}
