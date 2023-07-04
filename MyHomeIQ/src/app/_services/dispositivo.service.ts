import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { Device } from '../_models/device';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      const url = `${this.config.apiUrl}/devices/getList`;
  
      return this.httpClient.get<{ success: boolean, devices: Device[] }>(url).pipe(
          map(respuesta => respuesta.devices)
      );
  }

  statusDevice(idDevice:string){
    const url = `${this.config.apiUrl}/devices/status/${idDevice}`;

    return this.httpClient.get<Device["commands"]>(url);
  }

  statusDevices(idDevices: string[]):Observable<any> {
    const url = `${this.config.apiUrl}/devices/statusDevices/?idDevices=${idDevices}`;
  
    return this.httpClient.get(url);
  }

  videoStream(idDevice:string){
    const url = `${this.config.apiUrl}/devices/video/${idDevice}`;

    return this.httpClient.get(url);
  }

  deleteDevice(idDevice: string) {
    const url = `${this.config.apiUrl}/devices/delete/${idDevice}`;

    return this.httpClient.delete(url);
  }

}
