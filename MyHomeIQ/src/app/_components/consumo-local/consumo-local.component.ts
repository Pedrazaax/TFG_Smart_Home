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
  intervalosGuardados: boolean[];

  TPruebas!: TipoPruebaLocal[];
  filteredTPruebas!: TipoPruebaLocal[];
  selected_TPrueba!: TipoPruebaLocal;
  selectedRow!: number;

  PConsumos!: PruebaConsumoLocal[];
  filteredPConsumos!: PruebaConsumoLocal[];
  selected_PConsumo!: PruebaConsumoLocal;
  selectedRowPConsumo!: number;

  currentPagePConsumo = 1;
  currentPageTPrueba = 1;
  itemsPerPage = 10;
  pagedPConsumos: PruebaConsumoLocal[] = [];
  pagedTPruebas: TipoPruebaLocal[] = [];

  graficoConsumo!: any;
  graficoIntensidad!: any;
  isTestRunning: boolean = false;

  intensidadMediaDeIntervalos!: number[];
  intensidadMediaTotal!: number;
  potenciaMediaDeIntervalos!: number[];
  potenciaMediaTotal!: number;
  VoltajeMedioDeIntervalos!: number[];
  voltajeMedioTotal!: number;

  constructor(private controlLocalService: ControlLocalService, private toastr: ToastrService) {

    this.intervalosGuardados = [];
    
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
    this.getPConsumo();
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
    console.log(this.selected_PConsumo)
    this.getIntensidadMediaTotal()
    this.createGrafic();
  }

  private getIntensidadMediaTotal() {
    this.intensidadMediaTotal = 0;
    this.intensidadMediaDeIntervalos = [];
    let intervalos: IntervaloLocal[] = this.selected_PConsumo?.tipoPrueba.intervalos!;
    console.log(intervalos);
    let intensidadesDeIntervalos = intervalos?.map(inter => inter.current);
    intensidadesDeIntervalos.forEach(intensidadesPorIntervalos => {
      console.log(intensidadesPorIntervalos);
      if(intensidadesPorIntervalos === undefined || intensidadesPorIntervalos.length === 0) throw new Error("Array de energía vacío");
      else {
        let intensidadMediaDeIntervalo = this.calcularMediana(intensidadesPorIntervalos);
        this.intensidadMediaDeIntervalos.push(intensidadMediaDeIntervalo);
      }
      this.intensidadMediaTotal = this.calcularMediana(this.intensidadMediaDeIntervalos);
    });
  }

  private getPotenciaMedia() {

  }

  private getVoltajeMedio() {

  }

  private calcularMediana(valores: number[]): number {
    const sortedValues = valores.sort((a, b) => a - b);
    
    // Obtener la longitud del array
    const length = sortedValues.length;
    
    // Calcular la mediana
    if (length % 2 === 0) {
        // Si el array tiene un número par de elementos, se promedian los dos centrales
        const mid1 = sortedValues[length / 2 - 1];
        const mid2 = sortedValues[length / 2];
        return (mid1 + mid2) / 2;
    } else {
        // Si el array tiene un número impar de elementos, se toma el central
        return sortedValues[(length - 1) / 2];
    }
  }
  
  createGrafic() {
    let intervalos: IntervaloLocal[] = this.selected_PConsumo?.tipoPrueba.intervalos!;
    let consumos = intervalos.map(inter => inter.consumo);
    let intensidades = this.intensidadMediaDeIntervalos;
    let labels = intervalos.map((_, index) => `Intervalo ${index + 1}`);
  
    let dataBarConsumo = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Intervalos de consumo',
            data: consumos,
          },
        ],
      },
    };

    let dataBarIntensidades = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Intervalos de intensidad',
            data: intensidades,
          },
        ],
      },
    };
  
    // Si el gráfico existe, eliminar el canvas y crear uno nuevo
  const canvasContainerConsumo = document.getElementById('canvas-container-consumo');
  const canvasContainerIntensidad = document.getElementById('canvas-container-intensidad');
  if (canvasContainerConsumo && canvasContainerIntensidad) {
    canvasContainerConsumo.innerHTML = '<h2 class="text-center mb-4 text-xl">Consumo</h2><section class="w-full"><canvas id="bar-chart-consumo"></canvas></section>';
    canvasContainerIntensidad.innerHTML = '<h2 class="text-center mb-4 text-xl">Intensidad</h2><section class="w-full"><canvas id="bar-chart-intensidad"></canvas></section>';
  }
    // Crea un nuevo gráfico
    this.graficoConsumo = new Chart(document.getElementById('bar-chart-consumo') as HTMLCanvasElement, dataBarConsumo);
    this.graficoIntensidad = new Chart(document.getElementById('bar-chart-intensidad') as HTMLCanvasElement, dataBarIntensidades);
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

  this.intervalosGuardados = new Array(nIntervalos).fill(false);

}
  
  setIntervalo(index: number, time: number, script: string) {
    this.intervalos[index].time = time;
    this.intervalos[index].script = script;

    this.intervalosGuardados[index] = true;

    // Mantener el modal abierto
    this.modalTipoP.show();
  }

  get todosIntervalosGuardados(): boolean {
    const todosGuardados = this.intervalosGuardados.every(v => v);
    return todosGuardados;
  }
  

  savePConsumo() {
    const data = this.formPConsumo.value;

    console.log(data);

    this.modalPrueba.hide();

    this.isTestRunning = true;

    // Guardamos la prueba de consumo en el backend
    this.controlLocalService.savePConsumo(data).subscribe(
      (response) => {
        this.isTestRunning = false;
        alert('Prueba de consumo guardada');
        this.getPConsumo();
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

    // Borramos los controles del formulario
    this.formTPrueba.reset();

    // Borramos nIntervalos, time y script del objeto data
    delete data.nIntervalos;
    for (let i = 0; i <= this.intervalos.length; i++) {
      delete data['time' + i];
      delete data['script' + i];
    }

    // Añadimos a intervalos los valores consumo, current y voltage. Cosumo es floar, current y voltage son arrays de floats
    this.intervalos.forEach((intervalo) => {
      intervalo.consumo = 0.0;
      intervalo.current = [0.0];
      intervalo.voltage = [0.0];
    });


    // Añadimos los intervalos al objeto data
    data.intervalos = this.intervalos;

    console.log(data);
    // Guardamos el tipo de prueba en el backend
    this.controlLocalService.saveTPrueba(data).subscribe(
      (response) => {
        alert('Tipo de prueba guardado');
        this.getTPrueba();
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
        console.log(error);
      }
    );

  }

  delete(selected: any, key: string) {
    if (key === 'pconsumo') {
      // Delete PruebaConsumo
      this.controlLocalService.deletePConsumo(selected.name).subscribe(
        (response) => {
          alert('Prueba de consumo eliminada');
        },
        (error: any) => {
          this.toastr.error(error.error.detail, 'Error');
        }
      );
    } else if (key === 'tprueba') {
      console.log(selected);
      // Delete TipoPrueba
      this.controlLocalService.deleteTPrueba(selected.name).subscribe(
        (response) => {
          alert('Tipo de prueba eliminado');
        },
        (error: any) => {
          this.toastr.error(error.error.detail, 'Error');
        }
      );
    }
    this.getPConsumo();
    this.getTPrueba();
  }

  getTPrueba() {
    this.controlLocalService.getTPrueba().subscribe(
      (response: any) => {
        this.TPruebas = response;
        this.filteredTPruebas = [...this.TPruebas];
        this.updatePagedItems('TPruebas');
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );
  }

  getPConsumo() {
    this.controlLocalService.getPConsumo().subscribe(
      (response: any) => {
        this.PConsumos = response;
        this.filteredPConsumos = [...this.PConsumos];
        this.updatePagedItems('PConsumos');
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );
  }  

  setPage(page: number, type: 'PConsumos' | 'TPruebas') {
    if (type === 'PConsumos') {
      if (page < 1 || page > this.totalPages('PConsumos')) {
        return;
      }
      this.currentPagePConsumo = page;
    } else {
      if (page < 1 || page > this.totalPages('TPruebas')) {
        return;
      }
      this.currentPageTPrueba = page;
    }
    this.updatePagedItems(type);
  }

  totalPages(type: 'PConsumos' | 'TPruebas'): number {
    return Math.ceil((type === 'PConsumos' ? this.PConsumos.length : this.TPruebas.length) / this.itemsPerPage);
  }

  nextPage(type: 'PConsumos' | 'TPruebas') {
    if (type === 'PConsumos') {
      if (this.currentPagePConsumo < this.totalPages('PConsumos')) {
        this.setPage(this.currentPagePConsumo + 1, 'PConsumos');
      }
    } else {
      if (this.currentPageTPrueba < this.totalPages('TPruebas')) {
        this.setPage(this.currentPageTPrueba + 1, 'TPruebas');
      }
    }
  }

  prevPage(type: 'PConsumos' | 'TPruebas') {
    if (type === 'PConsumos') {
      if (this.currentPagePConsumo > 1) {
        this.setPage(this.currentPagePConsumo - 1, 'PConsumos');
      }
    } else {
      if (this.currentPageTPrueba > 1) {
        this.setPage(this.currentPageTPrueba - 1, 'TPruebas');
      }
    }
  }

  firstPage(type: 'PConsumos' | 'TPruebas') {
    this.setPage(1, type);
  }

  lastPage(type: 'PConsumos' | 'TPruebas') {
    this.setPage(this.totalPages(type), type);
  }

  private updatePagedItems(type: 'PConsumos' | 'TPruebas') {
    const currentPage = type === 'PConsumos' ? this.currentPagePConsumo : this.currentPageTPrueba;
    const items = type === 'PConsumos' ? this.filteredPConsumos : this.filteredTPruebas;
    const pagedItems = items.slice((currentPage - 1) * this.itemsPerPage, currentPage * this.itemsPerPage);

    if (type === 'PConsumos') {
      this.pagedPConsumos = pagedItems as PruebaConsumoLocal[];
    } else {
      this.pagedTPruebas = pagedItems as TipoPruebaLocal[];
    }
  }

  selectedTPrueba(tPrueba: any, indice: number) {
    this.selected_TPrueba = tPrueba;
    this.selectedRow = indice;
  }

  filterByCategory(type: 'PConsumos' | 'TPruebas', event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCategory = selectElement.value;

    if (type === 'PConsumos') {
      this.filteredPConsumos = selectedCategory ? this.PConsumos.filter(pConsumo => pConsumo.category === selectedCategory) : [...this.PConsumos];
      this.currentPagePConsumo = 1;
      this.updatePagedItems('PConsumos');
    } else if (type === 'TPruebas') {
      this.filteredTPruebas = selectedCategory ? this.TPruebas.filter(tPrueba => tPrueba.category === selectedCategory) : [...this.TPruebas];
      this.currentPageTPrueba = 1;
      this.updatePagedItems('TPruebas');
    }
  }

}