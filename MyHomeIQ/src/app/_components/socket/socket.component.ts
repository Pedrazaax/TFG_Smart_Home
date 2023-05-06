import { Component } from '@angular/core';
import { Device } from 'src/app/_models/device';
import { DispositivoService } from 'src/app/_services/dispositivo.service';

@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.css']
})
export class SocketComponent {
  sockets?: Device[];

  constructor (private DeviceService: DispositivoService){

  }

  ngOnInit(): void {
    this.listarDevices()
  }

  listarDevices(){
    this.DeviceService.listarDevices().subscribe(respuesta => {
      this.sockets = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'enchufe');;
      console.log(this.sockets)
    },
      (error: any) => {
        alert("Error")
      }
    )
  }
}
