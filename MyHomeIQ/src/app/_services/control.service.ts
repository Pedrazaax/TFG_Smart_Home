import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { KeysAPI } from '../_models/keysAPI';

@Injectable({
  providedIn: 'root'
})
export class ControlService {
  
  constructor(private httpClient: HttpClient, private config: AppConfig) { 
  }

  getHeaders() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agregar el token JWT en el encabezado
    });

    return headers;
  }

  getapiKeys(){
    const url = `${this.config.apiUrl}/keysAPI/`;

    return this.httpClient.get<KeysAPI>(url, { headers: this.getHeaders()});
  }

  apiKeys(keys: KeysAPI){
    const url = `${this.config.apiUrl}/keysAPI/addKeys`;

    return this.httpClient.post(url, keys, { headers: this.getHeaders() });
  }

}
