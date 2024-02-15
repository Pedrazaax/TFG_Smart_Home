import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { Device } from '../_models/device';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ControlService } from './control.service';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {
  constructor(private httpClient: HttpClient, private config: AppConfig, private header:ControlService) { }

  updateDevice(device:any) {
    const url = `${this.config.apiUrl}/devices/control`;

    return this.httpClient.post(url, device, {headers: this.header.getHeaders()});
  }

  createDevice(info:any) {
    const url = `${this.config.apiUrl}/devices/create`;

    return this.httpClient.post(url, info, {headers: this.header.getHeaders()});
  }

  listarDevices(): Observable<Device[]> {
      const url = `${this.config.apiUrl}/devices/getList`;
  
      return this.httpClient.get<{ success: boolean, devices: Device[] }>(url, {headers: this.header.getHeaders()}).pipe(
          map(respuesta => respuesta.devices)
      );
  }

  statusDevice(idDevice:string){
    const url = `${this.config.apiUrl}/devices/status/${idDevice}`;

    return this.httpClient.get<Device["commands"]>(url, {headers: this.header.getHeaders()});
  }

  statusDevices(idDevices: string[]):Observable<any> {
    const url = `${this.config.apiUrl}/devices/statusDevices/?idDevices=${idDevices}`;
  
    return this.httpClient.get(url, {headers: this.header.getHeaders()});
  }

  videoStream(idDevice:string){
    const url = `${this.config.apiUrl}/devices/video/${idDevice}`;

    return this.httpClient.get(url, {headers: this.header.getHeaders()});
  }

  deleteDevice(idDevice: string) {
    const url = `${this.config.apiUrl}/devices/delete/${idDevice}`;

    return this.httpClient.delete(url, {headers: this.header.getHeaders()});
  }

  updateNameModel(device: Device) {
    const url = `${this.config.apiUrl}/devices/updateDevice/`;

    return this.httpClient.put(url,device, {headers: this.header.getHeaders()});
  }

}
