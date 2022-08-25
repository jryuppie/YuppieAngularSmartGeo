import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Usuario } from 'src/app/models/usuario';
import { ConfiguracoesService } from '../configuracoes.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [MessageService, ConfirmationService, ConfiguracoesService]
})
export class UsuariosComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  usuarioDialog: boolean = false;

  usuarios: Usuario[] = [];

  usuario: Usuario = {};

  selectedUsuarios: Usuario[] = [];

  submitted: boolean = false;

  statuses: any[] = [];

  constructor(private configuracaoService: ConfiguracoesService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    //ATRIBUIR TITULO A PAGINA
    (document.getElementById('h1Titulo') as HTMLElement).innerHTML = 'Editor de Usuarios';
    //pegar  usuarios BASE
    this.configuracaoService.getUsuariosTeste().then(data => this.usuarios = data);

  }
  applyFilterGlobal($event: any, stringVal: any) {

    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  abrirNovo() {
    this.usuario = {};
    this.submitted = false;
    this.usuarioDialog = true;
  }

  deletarUsuarioSelecionado() {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja remover estes usuários?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarios = this.usuarios.filter(val => !this.selectedUsuarios.includes(val));
        this.selectedUsuarios = [];
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuários removido!', life: 3000 });
      }
    });
  }

  editarUsuario(usuario: Usuario) {
    this.usuario = { ...usuario };
    this.usuarioDialog = true;
  }

  deletarUsuario(usuario: Usuario) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja remover ' + usuario.nome + '?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarios = this.usuarios.filter(val => val.id !== usuario.id);
        this.usuario = {};
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário removido!', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.usuarioDialog = false;
    this.submitted = false;
  }

  salvarUsuario() {
    this.submitted = true;

    if (this.usuario.nome?.trim()) {
      if (this.usuario.id) {
        this.usuarios[this.findIndexById(this.usuario.id)] = this.usuario;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!', life: 3000 });
      }
      else {
        this.usuario.id = this.createId();
        this.usuario.avatar = 'usuario-placeholder.svg';
        this.usuarios.push(this.usuario);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado!', life: 3000 });
      }

      this.usuarios = [...this.usuarios];
      this.usuarioDialog = false;
      this.usuario = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}