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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { MenuLateralService } from './menu-lateral/menu-lateral.service';

import {DialogModule} from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {ListboxModule} from 'primeng/listbox';
import {PanelModule} from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import {InputTextModule} from 'primeng/inputtext';
import {TimelineModule} from 'primeng/timeline';
import { ChipModule } from 'primeng/chip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import {HttpClientModule} from '@angular/common/http';

import { NgParticlesModule } from "ng-particles";
@NgModule({
  declarations: [
    AppComponent,
    MapaEquipeComponent,
    AgendarRotasComponent,
    DashboardComponent,
    ConfiguracoesComponent,
    LoginComponent,
    MenuLateralComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,MatCardModule,MatDividerModule,MatProgressBarModule,MatFormFieldModule,
    FormsModule,ReactiveFormsModule,
    DialogModule,CardModule,ButtonModule,ListboxModule,PanelModule,MenuModule,InputTextModule,HttpClientModule,TimelineModule
    ,ChipModule,MatButtonToggleModule,MessageModule,MessagesModule,ToastModule,NgParticlesModule
  ],
  providers: [MenuLateralService],
  bootstrap: [AppComponent]
})
export class AppModule { }
