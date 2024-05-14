import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { KeysAPI } from '../_models/keysAPI';

@Injectable({
  providedIn: 'root'
})
export class ControlLocalService {

  constructor(private httpClient: HttpClient, private config: AppConfig) { }

  getHeaders() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agregar el token JWT en el encabezado
    });

    return headers;
  }

  getHA(){
    const url = `${this.config.apiUrl}/localDevices/getHA`;

    return this.httpClient.get(url, { headers: this.getHeaders()});
  }

  saveHA(token: string, dominio: string) {
    const url = `${this.config.apiUrl}/localDevices/saveHA`;

    const data = { token, dominio };

    console.log(data);

    return this.httpClient.post(url, data, { headers: this.getHeaders() });
  }

  getAll(){
    const url = `${this.config.apiUrl}/localDevices/`;

    return this.httpClient.get(url, { headers: this.getHeaders()});
  }

  saveTPrueba(data: any){
    const url = `${this.config.apiUrl}/localDevices/saveTPrueba`;

    return this.httpClient.post(url, data, { headers: this.getHeaders() });

  }

  getTPrueba(){
    const url = `${this.config.apiUrl}/localDevices/getTPrueba`;

    return this.httpClient.get(url, { headers: this.getHeaders()});
  }

  savePConsumo(data: any){
    const url = `${this.config.apiUrl}/localDevices/savePConsumo`;

    return this.httpClient.post(url, data, { headers: this.getHeaders() });
  }

}
