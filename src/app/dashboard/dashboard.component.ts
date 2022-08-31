import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DataChart } from '../models/dataChart';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService]
})

export class DashboardComponent implements OnInit {

  basicData: any;

  multiAxisData: any;

  multiAxisOptions: any;

  lineStylesData: any;

  basicOptions: any;

  subscription: Subscription | undefined;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    //ATRIBUIR TITULO A PAGINA
    (document.getElementById('h1Titulo') as HTMLElement).innerHTML = 'Dashboards';
  
      this.basicData = {
          labels: ['Janeiro', 'Fevereiro', 'Março', 'April', 'Maio', 'Junho', 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
          datasets: [
              {
                  label: 'Rotas inteligentes',
                  data: [50,55,60,70,88,50,55],
                  fill: false,
                  borderColor: '#42A5F5',
                  tension: .4
              },
              {
                  label: 'Rotas manuais',
                  data: [40,45,50,45,44,43,48],
                  fill: false,
                  borderColor: '#FFA726',
                  tension: .4
              }
          ]
      };
      
      this.applyDarkTheme();
       
  }
  
  
  applyLightTheme() {
      this.basicOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: '#495057'
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: '#495057'
                  },
                  grid: {
                      color: '#ebedef'
                  }
              },
              y: {
                  ticks: {
                      color: '#495057'
                  },
                  grid: {
                      color: '#ebedef'
                  }
              }
          }
      };

      
  }

//   --cor-base-autoluks:#212121;
//   --cor-base-complementar-autoluks: #a82e2e;
//   --background-sidebar-autoluks:url(https://www.autoluks.com.br/uploads/1/1/5/6/115643989/background-images/1817667807.jpg);
  applyDarkTheme() {
      this.basicOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: '#ebedef'
                  },
                  
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: '#ebedef'
                  },
                  grid: {
                      color: 'rgba(255,255,255,0.2)'
                  }
              },
              y: {
                  ticks: {
                      color: '#ebedef'
                  },
                  grid: {
                      color: 'rgba(255,255,255,0.2)'
                  }
              }
          }
      };      
  }
}