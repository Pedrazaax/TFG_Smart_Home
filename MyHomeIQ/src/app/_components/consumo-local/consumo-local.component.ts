import {Component} from '@angular/core';
import { HomeAssistant, IntervaloLocal, TipoPruebaLocal, PruebaConsumoLocal } from 'src/app/_models/prueba-consumo';
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
  formTPrueba: FormGroup;

  modalPrueba: any;
  modalTipoP: any;

  categories: string[] = ["light", "switch"];
  scripts!: any[];
  devicesCategory!: any[];
  allStatus!: any[];
  sockets!: any[];
  nIntervalos!: number;
  intervalos: IntervaloLocal[] = [];

  TPruebas!: TipoPruebaLocal[];
  selected_TPrueba!: TipoPruebaLocal;
  selectedRow!: number;

  PConsumos!: PruebaConsumoLocal[];
  selected_PConsumo!: PruebaConsumoLocal;
  selectedRowPConsumo!: number;

  constructor(private controlLocalService: ControlLocalService, private toastr: ToastrService) {
    this.formHA = new FormGroup({
      token: new FormControl('', [Validators.required]),
      dominio: new FormControl('', [Validators.required]),
    });

    this.formPConsumo = new FormGroup({
      name: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      device: new FormControl('', [Validators.required]),
      tipoPrueba: new FormControl('', [Validators.required]),
      socket: new FormControl('', [Validators.required]),
    });

    this.formTPrueba = new FormGroup({
      name: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      device: new FormControl('', [Validators.required]),
      nIntervalos: new FormControl('', [Validators.required]),
      time0: new FormControl('', [Validators.required]),
      script0: new FormControl('', [Validators.required]),
    });

  }

  ngOnInit() {
    this.modalPrueba = new Modal(document.getElementById('iniciarprueba'));
    this.modalTipoP = new Modal(document.getElementById('creartipoprueba'));

    this.flagHA = this.getHA();
    this.getAll();
    this.getTPrueba();
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
        this.initialArrays(response);

      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );
  }

  private initialArrays(response: any) {
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
    // Eliminamos los sockets undefined
    this.sockets = this.sockets.filter((item) => item !== undefined);
  }

  selectedPConsumo(pConsumo: PruebaConsumoLocal, indice: number) {
    this.selected_PConsumo = pConsumo;
    this.selectedRowPConsumo = indice;
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

  setNIntervalos(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const nIntervalos = parseInt(selectElement.value);

  // Ajusta el tamaño del array según el nuevo valor de nIntervalos
  if (nIntervalos > this.intervalos.length) {
    while (this.intervalos.length < nIntervalos) {
      const newIntervalo = { time: 0, script: '' };
      this.intervalos.push(newIntervalo);

      // Agrega los nuevos controles al FormGroup
      this.formTPrueba.addControl('time' + this.intervalos.length, new FormControl('', Validators.required));
      this.formTPrueba.addControl('script' + this.intervalos.length, new FormControl('', Validators.required));
    }
  } else if (nIntervalos < this.intervalos.length) {
    while (this.intervalos.length > nIntervalos) {
      // Elimina los controles del FormGroup
      this.formTPrueba.removeControl('time' + this.intervalos.length);
      this.formTPrueba.removeControl('script' + this.intervalos.length);

      this.intervalos.pop();
    }
  }
}
  
  setIntervalo(index: number, time: number, script: string) {
    this.intervalos[index].time = time;
    this.intervalos[index].script = script;

    // Mantener el modal abierto
    this.modalTipoP.show();
  }
  

  savePConsumo() {
    const data = this.formPConsumo.value;

    this.modalPrueba.hide();
    // Guardamos la prueba de consumo en el backend
    this.controlLocalService.savePConsumo(data).subscribe(
      (response) => {
        alert('Prueba de consumo guardada');
        console.log(response);
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );
    
  }

  saveTPrueba() {
    // Obtenemos los datos del formulario
    const data = this.formTPrueba.value;
    
    this.modalTipoP.hide();

    
    // Borramos nIntervalos, time y script del objeto data
    delete data.nIntervalos;
    for (let i = 0; i <= this.intervalos.length; i++) {
      delete data['time' + i];
      delete data['script' + i];
    }

    // Añadimos los intervalos al objeto data
    data.intervalos = this.intervalos;
    // Guardamos el tipo de prueba en el backend
    
    this.controlLocalService.saveTPrueba(data).subscribe(
      (response) => {
        alert('Tipo de prueba guardado');
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );

  }

  getTPrueba() {
    // Obtenemos el tipo de prueba del backend
    this.controlLocalService.getTPrueba().subscribe(
      (response: any) => {
        this.TPruebas = response;
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );
  }


  selectedTPrueba(tPrueba: any, indice: number) {
    this.selected_TPrueba = tPrueba;
    this.selectedRow = indice;
  }
}