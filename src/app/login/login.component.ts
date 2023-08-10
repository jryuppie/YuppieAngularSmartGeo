import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MoveDirection, ClickMode, HoverMode, OutMode, Engine, Container } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { LoginService } from './login.service';
import { MessageService } from 'primeng/api';
import { UsuarioDTO } from '../models/usuarioDTO';

import {NgForm} from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})


export class LoginComponent implements OnInit {
  usuarioLogin: string = '';
  senhaLogin: string = '';

  corTema: string = ''
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),


  });
  constructor(private router: Router, private loginService: LoginService, private messageService: MessageService) { }


  id = "tsparticles";
  particlesOptions = {
    background: {
      color: {
        value: '#212121'
      }
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: ClickMode.push
        },
        onHover: {
          enable: true,
          mode: HoverMode.repulse
        },
        resize: true
      },
      modes: {
        push: {
          quantity: 4
        },
        repulse: {
          distance: 200,
          duration: 1
        }
      }
    },
    particles: {
      color: {
        value: "#ffffff"
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1
      },
      collisions: {
        enable: true
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce
        },
        random: false,
        speed: 1,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 120
      },
      opacity: {
        value: 0.5
      },
      shape: {
        options: {
          character: {
            value: [
              "L",
              "U",
              "K",
              "S",
              
            ],
            font: "Verdana",
            style: "",
            weight: "200",
            fill: true
          },
          char: {
            value: [
              "M",
              "O",
              "V",
              "E",
            
            ],
            font: "Verdana",
            style: "",
            weight: "800",
            fill: true
          }
        },
        type: "char"
      },
      size: {
        value: { min: 1, max: 5},
      }
    },
    detectRetina: true,
   
  };

  
  



  particlesLoaded(container: Container): void {
    
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }



  cor: string = ''
  ngOnInit(): void {
    window.localStorage.clear();

    this.form = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });

    let docStyle = getComputedStyle(document.documentElement);

    //get variable
    this.cor = docStyle.getPropertyValue('--cor-base');



    // const onChangeHandler = () => {
    //   this.btnEntrar();
    // };

    // (document.getElementById("btnEntrar") as HTMLElement).addEventListener(
    //   "click",
    //   onChangeHandler
    // );

  }

 
  onSubmit(f: NgForm) {     
    this.BuscarLogin(f.value.documento, f.value.password)
  }

  async BuscarLogin(documento:string,senha:string) {
  // this.usuarioLogin = documento;
  // this.senhaLogin = senha;
  // localStorage.setItem('ativo', 'true');
  // localStorage.setItem('usuario', 'tester');
  // localStorage.setItem('funcao', 'teste');
  // localStorage.setItem('idUsuario', '1');
  // this.router.navigate(['/app/agendarPlanejar']);          


     return this.loginService.realizarLoginLuksMove(this.usuarioLogin, this.senhaLogin).subscribe((data: UsuarioDTO) => {
      
      if (data == null) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Usuario ou senha incorretos, tente novamente!' });

      } else {
        let idUsuario = data.id != undefined? data.id : 0;

        if (data?.status === true) {         
          localStorage.setItem('ativo', 'true');
          localStorage.setItem('usuario', data.documento!);
          localStorage.setItem('funcao', data.tipoUsuario!);
          localStorage.setItem('idUsuario', idUsuario.toString());
          this.router.navigate(['/app/agendarPlanejar']);          
        }
        else       
          this.router.navigate(['/login']);         
        
      }
    }, erro => { this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar o login, tente novamente!' }); });

  }

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }
  // @Input() error: string | null;

  @Output() submitEM = new EventEmitter();


}

