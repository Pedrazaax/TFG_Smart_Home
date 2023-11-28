import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { ControlService } from './control.service';
import { Room } from '../_models/room';
import { Device } from '../_models/device';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private httpClient:HttpClient, private config: AppConfig, private header: ControlService) { }

  listarRooms(): any{
    const url = `${this.config.apiUrl}/room/`;
    
    return this.httpClient.get<any>(url, {headers: this.header.getHeaders()})
  }

  addRoom(room:Room):any {
    const url = `${this.config.apiUrl}/room/addRoom`;
    return this.httpClient.post(url, room, {headers: this.header.getHeaders()});
  }

  deleteRoom(room:Room):any {
    const url = `${this.config.apiUrl}/room/deleteRoom/${room.id}`;
    return this.httpClient.delete(url, {headers: this.header.getHeaders()});
  }

  setRoom(device: Device, room:Room):any {
    const url = `${this.config.apiUrl}/room/setRoom`;
    return this.httpClient.post(url, {device, room}, {headers: this.header.getHeaders()});
  }

}
