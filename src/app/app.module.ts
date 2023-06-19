
//#region <Angular Componentes> 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
//#endregion

//#region <Material Componentes>  
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
//#endregion

//#region <Projeto Componentes>  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { MenuLateralService } from './menu-lateral/menu-lateral.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapaEquipeComponent } from './mapa-equipe/mapa-equipe.component';
import { AgendarRotasComponent } from './agendar-rotas/agendar-rotas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { LoginComponent } from './login/login.component';
import { UsuariosComponent } from './configuracoes/usuarios/usuarios.component';
import { ConfiguracoesService } from './configuracoes/configuracoes.service';
import { GoogleService } from './agendar-rotas/service/google.service'
//#endregion

//#region <Primeng Componentes>  
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { TimelineModule } from 'primeng/timeline';
import { ChipModule } from 'primeng/chip';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
//#endregion

//#region <Outros Componentes> 
import { NgParticlesModule } from "ng-particles";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//#endregion

//Melhorar a logica de versionamento posteriormente
export const APP_VERSION = '0.1.8';
@NgModule({
  declarations: [
    AppComponent,
    MapaEquipeComponent,
    AgendarRotasComponent,
    DashboardComponent,
    ConfiguracoesComponent,
    LoginComponent,
    MenuLateralComponent,
    UsuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule, MatCardModule, MatDividerModule, MatProgressBarModule, MatFormFieldModule,
    FormsModule, ReactiveFormsModule,
    DialogModule, CardModule, ButtonModule, ListboxModule, PanelModule, MenuModule, InputTextModule, HttpClientModule, TimelineModule
    , ChipModule, MatButtonToggleModule, MessageModule, MessagesModule, ToastModule, NgParticlesModule, ChartModule, ConfirmDialogModule, TableModule, RippleModule, ToolbarModule
    , PanelMenuModule, InputSwitchModule,InputNumberModule,CheckboxModule,ProgressSpinnerModule
  ],
  providers: [MenuLateralService, ConfiguracoesService, GoogleService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
