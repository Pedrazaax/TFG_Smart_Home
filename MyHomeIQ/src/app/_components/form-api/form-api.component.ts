import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-api',
  templateUrl: './form-api.component.html',
  styleUrls: ['./form-api.component.css']
})
export class FormAPIComponent {

  formulario: FormGroup

  /*
  China Data Center	https://openapi.tuyacn.com
  Western America Data Center	https://openapi.tuyaus.com
  Eastern America Data Center	https://openapi-ueaz.tuyaus.com
  Central Europe Data Center	https://openapi.tuyaeu.com
  Western Europe Data Center	https://openapi-weaz.tuyaeu.com
  India Data Center	https://openapi.tuyain.com
  */

  opciones = ["https://openapi.tuyacn.com","https://openapi.tuyaus.com","https://openapi-ueaz.tuyaus.com", "https://openapi.tuyaeu.com", "https://openapi-weaz.tuyaeu.com", "https://openapi.tuyain.com"]

  constructor(){
    this.formulario = new FormGroup({
      ACCESS_ID: new FormControl('', [Validators.required]),
      ACCESS_KEY: new FormControl('', [Validators.required]),
      API_ENDPOINT: new FormControl('', [Validators.required]),
      MQ_ENDPOINT: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void{

    if(this.formulario.valid){

      let info={
        ACCESS_ID: this.formulario.get('ACCESS_ID')!.value,
        ACCESS_KEY: this.formulario.get('ACCESS_KEY')!.value,
        API_ENDPOINT: this.formulario.get('API_ENDPOINT')!.value,
        MQ_ENDPOINT: this.formulario.get('MQ_ENDPOINT')!.value
      }
      console.log(info)
    }

  }

}
