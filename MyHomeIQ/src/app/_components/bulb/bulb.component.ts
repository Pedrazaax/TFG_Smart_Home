import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { DispositivoService } from 'src/app/_services/dispositivo.service';

@Component({
  selector: 'app-bulb',
  templateUrl: './bulb.component.html',
  styleUrls: ['./bulb.component.css']
})
export class BulbComponent {

  bombillas?: Device[];
  valor:any

  constructor(private deviceService: DispositivoService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.listarDevices()
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.bombillas = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'Bombilla');;
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
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
