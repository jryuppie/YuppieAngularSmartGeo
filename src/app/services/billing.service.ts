import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {OauthService} from './oauth.service'
import { environment } from '../../environments/environment.dev';
@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private apiBaseUrl = 'https://cloudbilling.googleapis.com/v1/';

  constructor(private http: HttpClient, private oauthService: OauthService) { }

  getBillingInfo() {
    
    const access_token = environment.access_token
    const projectId = environment.project_id
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    this.http.get<any>(`${this.apiBaseUrl}/projects/${projectId}/billingInfo`, { headers })
    .subscribe(response => {     
      debugger
    console.log(response)       
    });
  }
}