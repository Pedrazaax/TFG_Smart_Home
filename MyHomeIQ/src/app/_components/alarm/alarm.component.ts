import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { Estados } from 'src/app/_models/estados';
import { Jso } from 'src/app/_models/jso';
import { DispositivoService } from 'src/app/_services/dispositivo.service';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent {
  alarmas?: Device[];
  valor:any;

  //Commands keys

  showAlarma:boolean = false;

  constructor(private deviceService: DispositivoService, private toastr: ToastrService){

  }

  ngOnInit(): void {
    this.listarDevices();
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.alarmas = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'Alarma');
      this.updateStates();
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  updateDevice(event: Event, valorKey: string, dispositivo: Device) {
    console.log('id: ', dispositivo.idDevice, ' valorKey: ', valorKey)
    this.valor = (event.target as HTMLInputElement)?.checked;

    dispositivo.key = valorKey
    dispositivo.commands = [
      {
        code: valorKey,
        value: this.valor
      }
    ]

    this.deviceService.updateDevice(dispositivo).subscribe(respuesta => {
      this.toastr.success('Dispositivo modificado', 'Éxito')
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  updateState(idDevice: string) {
    this.deviceService.statusDevice(idDevice).subscribe(respuesta => {
      let estados: Device["commands"] = respuesta

      console.log('Estado de id: ', idDevice, ' Estado: ', respuesta)

      estados.forEach(element => {
        element.value = this.lowerLetters(element.value)
      });

      this.updateValues(idDevice, estados);
    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })
  }

  updateValues(idDevice: string, respuesta: Device["commands"]) {

  }

  updateStates() {
    let idDevices = this.alarmas!.map(device => device.idDevice);

    this.deviceService.statusDevices(idDevices).subscribe((respuesta: Estados) => {

      respuesta.result.forEach(element => {
        idDevices.forEach(idDevice => {
          if (element.id == idDevice) {
            this.updateValues(idDevice, element.status)
          }
        });

      });

    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })

  }

  delete(idDevice: string) {
    this.deviceService.deleteDevice(idDevice).subscribe(respuesta => {
      this.toastr.success("Dispositivo eliminado", "Éxito")
      this.listarDevices()
    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })
  }

  lowerLetters(switchValue: any): boolean {

    if (switchValue == "True") {
      return true
    } else if (switchValue == "False") {
      return false
    }

    return switchValue

  }

  toggleAlarmas() {
    this.showAlarma = !this.showAlarma;
  }

}
