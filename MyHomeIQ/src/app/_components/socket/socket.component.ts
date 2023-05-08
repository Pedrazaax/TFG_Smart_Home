import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { DispositivoService } from 'src/app/_services/dispositivo.service';

@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.css']
})
export class SocketComponent {
  sockets?: Device[];
  valor?:any


  constructor (private DeviceService: DispositivoService, private deviceService:DispositivoService, private toastr:ToastrService){

  }

  ngOnInit(): void {
    this.listarDevices()
  }

  listarDevices(){
    this.DeviceService.listarDevices().subscribe(respuesta => {
      this.sockets = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'Enchufe');;
      //console.log(this.sockets)
    },
      (error: any) => {
        alert("Error" + error.error.message)
      }
    )
  }

  updateDevice(event: Event, valorKey: string, dispositivo: Device) {
    this.valor = (event.target as HTMLInputElement)?.checked;

    dispositivo.key = valorKey
    dispositivo.commands = [
      {
        code: valorKey,
        value: this.valor
      }
    ]

    this.deviceService.updateDevice(dispositivo).subscribe(respuesta => {
      //console.log(respuesta)
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  delete(idDevice:string){
    this.deviceService.deleteDevice(idDevice).subscribe(respuesta =>{
      console.log(respuesta)
      this.toastr.success("Dispositivo eliminado", "Éxito")
    }, error =>{
      this.toastr.error(error.error.detail, "Error")
    })
  }


}
