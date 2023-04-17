import { Component } from '@angular/core';
import { DispositivoService } from '../dispositivo.service';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.component.html',
  styleUrls: ['./dispositivo.component.css']
})
export class DispositivoComponent {

  ngOnInit(): void {
  }

  constructor(private dispositivoService: DispositivoService) { }

  updateDevice(event: MouseEvent, valorKey:string) {
    let isChecked = (event.target as HTMLInputElement)?.checked;

    console.log(valorKey)

    const device = {
      idDevice: "bfb14fa2967d0a5f67cql1",
      key: valorKey,
      commands: [
        {
          code: "switch",
          value: isChecked
        }
      ]
    };

    this.dispositivoService.updateDevice(device).subscribe(respuesta => {
      //console.log(respuesta)
    },
      (error: any) => {
        alert("Error")
      }
    )
  }

}




