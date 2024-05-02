import {Component} from '@angular/core';
import { HomeAssistant, PruebaConsumo } from 'src/app/_models/prueba-consumo';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ControlLocalService } from 'src/app/_services/control-local.service';
import { ToastrService } from 'ngx-toastr';
import { Chart, initTE, Ripple, Modal } from 'tw-elements';

initTE({ Chart, Ripple, Modal });

@Component({
  selector: 'app-consumo-local',
  templateUrl: './consumo-local.component.html',
  styleUrls: ['./consumo-local.component.css']
})
export class ConsumoLocalComponent {

  flagHA: boolean = false;
  homeAssistant!: HomeAssistant;
  formHA: FormGroup;
  formPConsumo: FormGroup;

  modalPrueba: any;
  modalTipoP: any;

  categories: string[] = ["light", "switch"];
  scripts!: string[];
  devicesCategory!: any[];
  allStatus!: any[];
  sockets!: any[];

  constructor(private controlLocalService: ControlLocalService, private toastr: ToastrService) {
    this.formHA = new FormGroup({
      token: new FormControl('', [Validators.required]),
      dominio: new FormControl('', [Validators.required]),
    });

    this.formPConsumo = new FormGroup({
      category: new FormControl('', [Validators.required]),
      device: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.modalPrueba = new Modal(document.getElementById('iniciarprueba'));
    this.modalTipoP = new Modal(document.getElementById('creartipoprueba'));

    this.flagHA = this.getHA();
    this.getAll();
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

  async getAll() {
    // Obtenemos los scripts del backend
    this.controlLocalService.getAll().subscribe(
      (response: any) => {
        this.allStatus = response;
        this.categories = response.map((item: any) => item.entity_id.split('.')[0]);
        // Eliminamos las categorías duplicadas
        this.categories = this.categories.filter((item, index) => this.categories.indexOf(item) === index);
        this.scripts = response.map((item: any) => {
          if (item.entity_id.split('.')[0] === 'script') {
            return item;
          }
        });
        // Eliminamos los scripts undefined
        this.scripts = this.scripts.filter((item) => item !== undefined);
        this.sockets = response.map((item: any) => {
          if (item.entity_id.split('.')[0] === 'switch') {
            return item;
          }
        });
        console.log(this.allStatus);
        console.log(this.scripts);
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );
  }

  selectedPrueba(pConsumo: PruebaConsumo, indice: Number) {

  }

  togglePrueba() {
    this.modalPrueba.toggle();
  }

  toggleTipoP() {
    this.modalTipoP.toggle();
  }

  setCategory(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const category = selectElement.value;
    // Seleccionamos los dispositivos de la categoría seleccionada
    this.devicesCategory = this.allStatus.filter((item: any) => item.entity_id.split('.')[0] === category);
  }
  

  savePConsumo() {
    alert('Prueba de consumo guardada');
    this.modalPrueba.hide();
    /* Guardamos la prueba de consumo en el backend
    this.controlLocalService.savePConsumo().subscribe(
      (response) => {
        console.log(response);
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );
    */
  }

}