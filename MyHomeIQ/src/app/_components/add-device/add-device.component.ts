import { Component } from '@angular/core';
import { DispositivoService } from '../../_services/dispositivo.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent {

  state: boolean = false

  formulario:FormGroup;
  opciones = ["Termostato", "Sensor", "Bombilla", "Camara", "Enchufe"]

  ngOnInit(): void {
  }

  constructor(private dispositivoService: DispositivoService, private toastr: ToastrService) {
    this.formulario = new FormGroup({
      nameDevice: new FormControl('', [Validators.required]),
      idDevice: new FormControl('', [Validators.required]),
      tipoDevice: new FormControl('', Validators.required),
    });
  }

  onImputChange() {
    this.state = this.formulario.valid;
  }

  addDevice(){

    let info = {
      name: this.formulario.get('nameDevice')!.value,
      idDevice: this.formulario.get('idDevice')!.value,
      tipoDevice: this.formulario.get('tipoDevice')!.value,
    };

    this.dispositivoService.createDevice(info).subscribe((respuesta: any) => {
      this.toastr.success('Dispositivo añadido', 'Éxito');
    },error =>{
      this.toastr.error('Error', error.message);
    })

  }


}
