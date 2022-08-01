import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendarRotasComponent } from './agendar-rotas/agendar-rotas.component';
import { LoginComponent } from './login/login.component';
import { MapaEquipeComponent } from './mapa-equipe/mapa-equipe.component';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';

const routes: Routes = [ 
  {
    path: '',
    component: MenuLateralComponent    
  },
  {
    path: 'login',
    component: LoginComponent    
  },
  {
    path: 'mapaEquipe',        
    component: MapaEquipeComponent
  },
  {
    path: 'agendarPlanejar',        
    component: AgendarRotasComponent
  } ,
  {
    path: 'app',    
    component: MenuLateralComponent,
    children: [
      {
        path: 'mapaEquipe',        
        component: MapaEquipeComponent
      },
      {
        path: 'agendarPlanejar',        
        component: AgendarRotasComponent
      }      
    ]
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
