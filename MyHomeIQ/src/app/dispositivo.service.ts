import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  constructor(private httpClient: HttpClient, private config: AppConfig) { }

  updateDevice(device:any) {
    const url = `${this.config.apiUrl}/devices/control`;

    return this.httpClient.post(url, device);
  }

  createDevice(info:any) {
    const url = `${this.config.apiUrl}/devices/create`;

    return this.httpClient.post(url, info)
  }

}
