import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { DispositivoService } from 'src/app/_services/dispositivo.service';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.component.html',
  styleUrls: ['./thermostat.component.css']
})
export class ThermostatComponent {

  termostatos?: Device[];
  valor: any
  temperatureValue: any = -1

  constructor(private deviceService: DispositivoService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.listarDevices()
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.termostatos = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'Termostato');;
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  updateDevice(event: Event, valorKey: string, dispositivo: Device) {
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

  private control_value(valorKey: string) {
    if (this.temperatureValue != "on") {
      this.valor = this.temperatureValue;
    }

    // Actualiza el elemento output con el valor seleccionado
    if (valorKey == "temp_set") {
      let temperatureOutput = document.getElementById('temperatureValue');
      if (temperatureOutput) {
        temperatureOutput.textContent = `${this.temperatureValue} ºC`;
      }
    }
    if (valorKey == "upper_temp") {
      let temperatureOutput_upper = document.getElementById('temperatureValue_upper');
      if (temperatureOutput_upper) {
        temperatureOutput_upper.textContent = `${this.temperatureValue} ºC`;
      }
    }
  }

}
