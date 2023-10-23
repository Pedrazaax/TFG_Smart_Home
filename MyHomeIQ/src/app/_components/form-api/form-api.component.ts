import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { KeysAPI } from 'src/app/_models/keysAPI';
import { AccountService } from 'src/app/_services/account.service';
import { ControlService } from 'src/app/_services/control.service';

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

  constructor(private controlService: ControlService, private router: Router){
    this.formulario = new FormGroup({
      ACCESS_ID: new FormControl('', [Validators.required]),
      ACCESS_KEY: new FormControl('', [Validators.required]),
      API_ENDPOINT: new FormControl('', [Validators.required]),
      MQ_ENDPOINT: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.get_APIkeys();
  }

  get_APIkeys(): void{
    this.controlService.getapiKeys().subscribe(
      respuesta => {

        if (respuesta != null) {
          // Valores a los campos del formulario
          this.formulario.patchValue({
            ACCESS_ID: respuesta.access_id,
            ACCESS_KEY: respuesta.access_key,
            API_ENDPOINT: respuesta.api_endpoint,
            MQ_ENDPOINT: respuesta.mq_endpoint
          });
          delay(2)
          this.router.navigate(['/panel'])
        }

      },
        (error: any)=>{
          console.log(error)
          alert("Error " + error.error.detail)
      }
    )
  }

  onSubmit(): void{

    if(this.formulario.valid){

      let info={
        ACCESS_ID: this.formulario.get('ACCESS_ID')!.value,
        ACCESS_KEY: this.formulario.get('ACCESS_KEY')!.value,
        API_ENDPOINT: this.formulario.get('API_ENDPOINT')!.value,
        MQ_ENDPOINT: this.formulario.get('MQ_ENDPOINT')!.value
      }
      
      let keysApiObject: KeysAPI = {
        username: sessionStorage.getItem('username')!,
        access_id: info.ACCESS_ID,
        access_key: info.ACCESS_KEY,
        api_endpoint: info.API_ENDPOINT,
        mq_endpoint: info.MQ_ENDPOINT
      };
      
      this.controlService.apiKeys(keysApiObject).subscribe(
        respuesta => {
          console.log(respuesta)
          this.router.navigate(['/panel'])
        },
        (error: any)=>{
          console.log(error)
          alert("Error " + error.error.detail)
        }
      )

    }

  }

}
