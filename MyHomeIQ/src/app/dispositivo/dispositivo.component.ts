import { Component } from '@angular/core';
import { DispositivoService } from '../dispositivo.service';
import { Device } from '../device';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.component.html',
  styleUrls: ['./dispositivo.component.css']
})
export class DispositivoComponent {

  valor:any
  temperatureValue:any = -1

  ngOnInit(): void {
  }

  constructor(private dispositivoService: DispositivoService) { }

  updateDevice(event: MouseEvent, valorKey:string) {
    this.valor = (event.target as HTMLInputElement)?.checked;
    this.temperatureValue = (event.target as HTMLInputElement)?.value;

    this.control_value(valorKey);

    let device = new Device(
      "bfb14fa2967d0a5f67cql1",
      valorKey,
      [
          {
              code: valorKey,
              value: this.valor
          }
      ]
    );

    this.dispositivoService.updateDevice(device).subscribe(respuesta => {
      //console.log(respuesta)
    },
      (error: any) => {
        alert("Error")
      }
    )
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




