import {Component} from '@angular/core';
import { HomeAssistant } from 'src/app/_models/prueba-consumo';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ControlLocalService } from 'src/app/_services/control-local.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consumo-local',
  templateUrl: './consumo-local.component.html',
  styleUrls: ['./consumo-local.component.css']
})
export class ConsumoLocalComponent {

  flagHA: boolean = false;
  homeAssistant!: HomeAssistant;
  formHA: FormGroup;

  constructor(private controlLocalService: ControlLocalService, private toastr: ToastrService) {
    this.formHA = new FormGroup({
      token: new FormControl('', [Validators.required]),
      dominio: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.flagHA = this.getHA();
    this.getScripts();
  }

  saveHA() {
    // Guardamos el atributo homeAssistant en el backend
    if (this.formHA.valid) {
      this.homeAssistant = new HomeAssistant(this.formHA.get('token')!.value, this.formHA.get('dominio')!.value);
      this.controlLocalService.saveHA(this.homeAssistant.token, this.homeAssistant.dominio).subscribe(
        (response) => {
          console.log(response);
          this.flagHA = true;
        },
        (error: any) => {
          this.toastr.error(error.error.detail, 'Error');
        }
      );
    }
  }

  getHA() {
    let flag: boolean = true;
    // Obtenemos el atributo homeAssistant del backend
    this.controlLocalService.getHA().subscribe(
      (response: any) => {
        console.log(response);
        if (response === null) {
          flag = false;
        } else {
          this.homeAssistant = new HomeAssistant(response.token, response.dominio);
        }
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );

    return flag;
  }

  getScripts() {
    // Obtenemos los scripts del backend
    this.controlLocalService.getScripts().subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );
  }

}