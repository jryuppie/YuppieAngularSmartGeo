import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(private http: HttpClient) { }

  async getAccessToken() {
    let data = null
    const clientId = environment.client_id;
    const clientSecret = environment.client_secret;
    const refreshToken = environment.refresh_token;
    const grantType = 'refresh_token';


    const body = `client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=${grantType}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post('https://oauth2.googleapis.com/token', body, { headers })
      .subscribe(response => {
        data = response
        console.log(response)
      });
  }

  //


  async getAccessCode() {
    const clientId = '';
    const scope = 'https://www.googleapis.com/auth/cloud-billing'
    const response_type = 'code'
    const access_type = 'offline'
    const redirect_uri = 'https://google.com'
    // Headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });


    const url = `https://accounts.google.com/o/oauth2/auth?scope=${scope}&response_type=${response_type}&access_type=${access_type}&redirect_uri=${redirect_uri}&client_id=${clientId}`;

    // Send the POST request to the OAuth 2.0 server
    await this.http.get(url, { headers })
      .subscribe(data => {
        return data
      });



  }
}


