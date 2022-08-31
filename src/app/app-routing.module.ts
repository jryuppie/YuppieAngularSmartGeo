import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendarRotasComponent } from './agendar-rotas/agendar-rotas.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { UsuariosComponent } from './configuracoes/usuarios/usuarios.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MapaEquipeComponent } from './mapa-equipe/mapa-equipe.component';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [ 
  {
    path: '',
    component: LoginComponent    
  },
  {
    path: 'login',
    component: LoginComponent    
  },  
  {
    path: 'app',    
    component: MenuLateralComponent,
    children: [
      {
        path: 'mapaEquipe',  
        canActivate: [AuthGuard],      
        component: MapaEquipeComponent
      },
      {
        path: 'agendarPlanejar',  
        canActivate: [AuthGuard],           
        component: AgendarRotasComponent
      },      
      {
        path: 'dashboard',   
        canActivate: [AuthGuard],          
        component: DashboardComponent
      }    
      ,      
      {
        path: 'configuracoes', 
        canActivate: [AuthGuard],            
        component: ConfiguracoesComponent
      }  
      ,      
      {
        path: 'usuarios',
        canActivate: [AuthGuard],             
        component: UsuariosComponent
      }      
    ]
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
