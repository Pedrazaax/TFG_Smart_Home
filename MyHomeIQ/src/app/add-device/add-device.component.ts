import { Component } from '@angular/core';
import { DispositivoService } from '../dispositivo.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent {

  add: boolean = false

  idDevice?: string;
  tipoDevice?: string;

  opciones = ["Termostato", "Interruptor", "Bombilla", "Cámara", "Enchufe"]

  ngOnInit(): void {
  }

  constructor(private dispositivoService: DispositivoService) { }

  addTrue(){
    this.add = true;
  }

  addDevice(){

    let info = {
      idDevice: this.idDevice,
      tipoDevice: this.tipoDevice
    }

    console.log(info)

    this.dispositivoService.createDevice(info).subscribe((respuesta: any) => {
      console.log(respuesta);
    })

  }


}
