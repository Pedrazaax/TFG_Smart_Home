import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { Device } from '../_models/device';
import { Observable } from 'rxjs';

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

    return this.httpClient.post(url, info);
  }

  listarDevices(): Observable<Device[]> {
    const url = `${this.config.apiUrl}/devices/`;

    return this.httpClient.get<Device[]>(url);
  }

  stateDevice(idDevice:string){
    const url = `${this.config.apiUrl}/devices/state/${idDevice}`;

    return this.httpClient.get(url);
  }

}
