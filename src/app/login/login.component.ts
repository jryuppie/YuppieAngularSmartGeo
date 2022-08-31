import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MoveDirection, ClickMode, HoverMode, OutMode, Engine, Container } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { LoginService } from './login.service';
import { MessageService } from 'primeng/api';
import { Usuario } from '../models/usuario';

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
    console.log(container);
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



    const onChangeHandler = () => {
      this.btnEntrar();
    };

    (document.getElementById("btnEntrar") as HTMLElement).addEventListener(
      "click",
      onChangeHandler
    );

  }

  btnEntrar() {
    debugger;
    this.BuscarLogin()
  }

  BuscarLogin() {
    let user: Usuario = {
      funcao: 'Desenvolvedor', id: 1, nome: 'Jonathan', usuario : 'jonedur'
    }
    localStorage.setItem('ativo', 'true');
    localStorage.setItem('usuario', user.usuario!);
    localStorage.setItem('funcao', user.funcao!);
    localStorage.setItem('idUsuario', user.toString());
    this.router.navigate(['/app/mapaEquipe']);
    return true;

    return this.loginService.VerificarLogin(this.usuarioLogin, this.senhaLogin).subscribe((data: Usuario) => {
      data = user;
      if (data == null) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Usuario ou senha incorretos, tente novamente!' });

      } else {
        let idUsuario = data.id != undefined? data.id : 0;

        if (data?.habilitado === true) {
          debugger;
          localStorage.setItem('ativo', 'true');
          localStorage.setItem('usuario', data.usuario!);
          localStorage.setItem('funcao', data.funcao!);
          localStorage.setItem('idUsuario', idUsuario.toString());
          this.router.navigate(['/inicio']);
        }
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

