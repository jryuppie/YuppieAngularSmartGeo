import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapaEquipeComponent } from './mapa-equipe/mapa-equipe.component';
import { AgendarRotasComponent } from './agendar-rotas/agendar-rotas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    MapaEquipeComponent,
    AgendarRotasComponent,
    DashboardComponent,
    ConfiguracoesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
