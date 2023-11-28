import { Injectable } from '@angular/core';
import { Device } from '../_models/device'; // Asegúrate de importar tu modelo de dispositivo
import { Room } from '../_models/room'; // Asegúrate de importar tu modelo de habitación
import { DispositivoService } from './dispositivo.service'; // Asegúrate de importar tu servicio de dispositivo

@Injectable({
    providedIn: 'root'
})
export class DeviceFilterService {
    private selectedRoom?: Room;
    private devices?: Device[];

    constructor(private deviceService: DispositivoService) {
        this.deviceService.listarDevices().subscribe((devices: Device[]) => {
            this.devices = devices;
        });
    }

    selectRoom(room: Room) {
        this.selectedRoom = room;
    }

    getFilteredDevices(): Device[] {
        if (this.selectedRoom) {
            return this.devices!.filter(device => device.room.name === this.selectedRoom?.name);
        } else {
            return [];
        }
    }
}