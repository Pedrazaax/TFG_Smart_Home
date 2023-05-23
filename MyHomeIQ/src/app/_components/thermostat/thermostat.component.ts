import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { DispositivoService } from 'src/app/_services/dispositivo.service';


interface jso {
  [key: string]: any;
}

interface Estados {
  result: [{
    id: string,
    status: Device["commands"]
  }];
  success: boolean;
  t: number;
  tid: string;
}

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.component.html',
  styleUrls: ['./thermostat.component.css']
})

export class ThermostatComponent {
  termostatos?: Device[];
  valor: any;
  temperatureValue: any = -1;

  switch: jso = {};
  child: jso = {};
  eco: jso = {};
  temp_set: jso = {};
  upper_temp: jso = {};

  showTermostatos: boolean = false;

  constructor(private deviceService: DispositivoService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.listarDevices();
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.termostatos = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'Termostato');
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
    this.temperatureValue = (event.target as HTMLInputElement)?.value;

    this.control_value(valorKey);

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

    //Code switch
    let switchItem = respuesta.filter(item => item.code === 'switch');

    if (switchItem) {
      let switchValue = switchItem[0].value;
      this.switch[idDevice] = switchValue;
    }

    //Code child_lock
    let childItem = respuesta.filter(item => item.code === 'child_lock');

    if (childItem) {
      let childValue = childItem[0].value;
      this.child[idDevice] = childValue;
    }

    //Code eco
    let ecoItem = respuesta.filter(item => item.code === 'eco');

    if (ecoItem[0]) {
      let ecoValue = ecoItem[0].value;
      this.eco[idDevice] = ecoValue;
    } else {
      this.eco[idDevice] = false;
    }

    //Code temp_set
    let temp_setItem = respuesta.filter(item => item.code === 'temp_set');

    if (temp_setItem) {
      let temp_setValue = temp_setItem[0].value;
      this.temp_set[idDevice] = temp_setValue;
    }

    //Code upper_temp
    let upper_tempItem = respuesta.filter(item => item.code === 'upper_temp');

    if (upper_tempItem) {
      let upper_tempValue = upper_tempItem[0].value;
      this.upper_temp[idDevice] = upper_tempValue;
    }

  }

  updateStates() {
    let idDevices = this.termostatos!.map(device => device.idDevice);

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

  private control_value(valorKey: string) {
    if (this.temperatureValue != "on") {
      this.valor = this.temperatureValue;
    }
  }

  lowerLetters(switchValue: any): boolean {

    if (switchValue == "True") {
      return true
    } else if (switchValue == "False") {
      return false
    }

    return switchValue

  }

  toggleTermostatos() {
    this.showTermostatos = !this.showTermostatos;
  }
  
}





