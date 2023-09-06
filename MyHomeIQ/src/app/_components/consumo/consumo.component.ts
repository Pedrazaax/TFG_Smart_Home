import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Device } from 'src/app/_models/device';
import { Chart, initTE, Ripple, Modal } from 'tw-elements';
import { DispositivoService } from 'src/app/_services/dispositivo.service';
import { IntervaloPrueba, PruebaConsumo, Status, TipoPrueba } from 'src/app/_models/prueba-consumo';
import { ConsumoService } from 'src/app/_services/consumo.service';
import { ToastrService } from 'ngx-toastr';

initTE({ Chart, Ripple, Modal });

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.css']
})

export class ConsumoComponent {
  @ViewChildren('circle') circleRefs!: QueryList<ElementRef<SVGElement>>;

  modalPrueba: any;
  modalTipoP: any;
  
  grafico: any;

  load: boolean = false;
  check: boolean = false;

  tipoDevice!: string;
  device!: Device;
  idDevice!: string;
  nameDevice!: string;
  tipoPrueba?: TipoPrueba;
  enchufe_idDevice!: string;
  sockets?: Device[];
  devices?: Device[];

  newpConsumo!: PruebaConsumo;
  selected_pConsumo?: PruebaConsumo;
  selected_socket?: Device;
  selected_device?: Device;
  pruebasConsumo?: PruebaConsumo[];
  tipoPruebas?: TipoPrueba[];

  selectedRow!: number;

  newTipoPrueba?: TipoPrueba;
  nombreTipoPrueba!: string;
  tipoDeviceTP!: string;


  intervaloPrueba!: IntervaloPrueba[];
  intervalos_bombilla: IntervaloPrueba[] = [];
  time!: number;
  status!: Status[];
  n_intervalos: number = 0;

  next: boolean = false;

  pag_status: number = 0;

  // Bombilla
  activeContent: string = '';
  rgb!: string;
  valor: any
  hsv: any;

  switch_led: Status = {
    code: "switch_led",
    value: true
  };
  work_mode: Status = {
    code: "work_mode",
    value: "white"
  };
  bright_value_v2 = {
    code: "bright_value_v2",
    value: 500
  };
  temp_value_v2 = {
    code: "temp_value_v2",
    value: 500
  };
  colour_data_v2 = {
    code: "colour_data_v2",
    value: "{\"h\":0,\"s\":0,\"v\":1000}"
  };

  // Listar Tipo de pruebas
  selectedTDevice: string = '';
  selectedTPRow?: number;
  selectedTPrueba?: TipoPrueba;



  constructor(private deviceService: DispositivoService, private consumoService: ConsumoService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.modalPrueba = new Modal(document.getElementById('iniciarprueba'));
    this.modalTipoP = new Modal(document.getElementById('creartipoprueba'));

    this.getPsConsumo();
    this.getDevices();
    this.getTipoPruebas();

    this.constructor_intervalo_bombilla();
  }

  togglePrueba() {
    this.modalPrueba.toggle();
  }

  toggleTipoP() {
    this.modalTipoP.toggle();
  }

  toggleNext() {
    this.next = !this.next;
  }

  constructor_intervalo_bombilla(){
    let newBombillaStatus : Status[] = [
      {
        code: "switch_led",
        value: true
      },
      {
        code: "work_mode",
        value: "white"
      },
      {
        code: "bright_value_v2",
        value: 500
      },
      {
        code: "temp_value_v2",
        value: 500
      },
      {
        code: "colour_data_v2",
        value: "{\"h\":0,\"s\":0,\"v\":1000}"
      },
    ]
    this.intervalos_bombilla[0] = new IntervaloPrueba(0, newBombillaStatus);
  }

  addIntervalo(){

    if(this.n_intervalos < 3){
      this.n_intervalos = this.n_intervalos + 1;

      if (this.tipoDeviceTP == 'Light Source'){
        let newBombillaStatus : Status[] = [
          {
            code: "switch_led",
            value: true
          },
          {
            code: "work_mode",
            value: "white"
          },
          {
            code: "bright_value_v2",
            value: 500
          },
          {
            code: "temp_value_v2",
            value: 500
          },
          {
            code: "colour_data_v2",
            value: "{\"h\":0,\"s\":0,\"v\":1000}"
          },
        ]

        this.intervalos_bombilla[this.n_intervalos] = new IntervaloPrueba(0,newBombillaStatus);
        this.intervaloPrueba = this.intervalos_bombilla;
      }
    } else {
      this.toastr.error('No se pueden añadir más intervalos', 'Error');
    }
  }

  deleteIntervalo(intervalo: IntervaloPrueba){
    if (this.tipoDeviceTP == 'Light Source'){
      this.intervalos_bombilla = this.intervalos_bombilla.filter(item => item !== intervalo);
    }

    this.changeDetector.detectChanges();
  }

  /* Métodos de bomibillas */

  ajustes() {
    if (this.activeContent == 'ajustes') {
      this.activeContent = ''
    } else {
      this.activeContent = 'ajustes';
    }

  }

  colores() {
    if (this.activeContent == 'color') {
      this.activeContent = ''
    } else {
      this.activeContent = 'color';
    }
  }

  updateColor(color: any, intervalo : IntervaloPrueba) {
    let match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    let r = parseInt(match[1]);
    let g = parseInt(match[2]);
    let b = parseInt(match[3]);

    // Selecciona el elemento circle que es hijo del elemento svg
    let circle = document.querySelector('circle');
    circle?.setAttribute('fill', color);

    this.hsv = this.rgbToHsv(r, g, b)
    this.valor = {
      "h": this.hsv[0],
      "s": this.hsv[1],
      "v": this.hsv[2]
    }

    this.valor = JSON.stringify(this.valor)
    intervalo.status[4].value = this.valor;
  }

  rgbToHsv(r: number, g: number, b: number): [number, number, number] {
    let max = Math.max(r, g, b), min = Math.min(r, g, b),
      d = max - min,
      h = 0,
      s = (max === 0 ? 0 : d / max),
      v = max / 255;

    switch (max) {
      case min: h = 0; break;
      case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
      case g: h = (b - r) + d * 2; h /= 6 * d; break;
      case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return [Math.round(h * 360), Math.round(s * 1000), Math.round(v * 1000)];
  }

  /* Fin metodos de bombillas */

  onSubmit() {
    this.newpConsumo = new PruebaConsumo(this.tipoDevice, this.tipoPrueba!, this.idDevice, this.enchufe_idDevice)
    this.modalPrueba.hide(); 

    this.load = true

    this.consumoService.createPConsumo(this.newpConsumo).subscribe(
      (respuesta: PruebaConsumo) => {
        this.load = false;
        this.check = true;

        this.clearAtributes();
        this.getPsConsumo();
        
        // Tiempo en el que se muestra el check de 2 segundos
        setTimeout(() => {
          this.check =  false;
        }, 2000);

      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    )
  }

  onSubmitTP() {
    this.newTipoPrueba = new TipoPrueba(this.intervaloPrueba, this.nombreTipoPrueba, this.tipoDeviceTP);
    
    /* Finalizar metodo con el servicio para que se cree el tipo de prueba */
    this.consumoService.createTipoPrueba(this.newTipoPrueba).subscribe(
      (respuesta: TipoPrueba) => {
        this.clearAtributesTP()
        this.getTipoPruebas();
        this.toastr.success('Prueba creada', 'Éxito')
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    )

  }

  onSubmitIntervalo(index: number) {
    this.intervaloPrueba[index] = new IntervaloPrueba(this.time, this.status);
  }

  getPsConsumo() {
    this.consumoService.getPruebasConsumo().subscribe(
      (respuesta: PruebaConsumo[]) => {
        this.pruebasConsumo = respuesta;
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    )
  }

  getTipoPruebas() {
    this.consumoService.getTipoPruebas().subscribe(
      (respuesta: TipoPrueba[]) => {
        this.tipoPruebas = respuesta
        console.log(this.tipoPruebas)
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
      )
  }

  getDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.sockets = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'Socket');
      this.devices = respuesta.filter((dispositivo) => dispositivo.tipoDevice !== 'Socket');
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  selectedPrueba(pConsumo: PruebaConsumo, index: number) {
    this.selected_pConsumo = pConsumo;
    this.selectedRow = index;

    // Grafico
    this.createGrafic();

    this.sockets?.forEach(socket => {
      if (socket.idDevice == pConsumo.idSocket) {
        this.selected_socket = socket;
      }
    });

    this.devices?.forEach(device => {
      if (device.idDevice == pConsumo.idDevice) {
        this.selected_device = device;
      }
    });

  }

  selectedTipoPrueba(tprueba: TipoPrueba, index: number){
    this.selectedTPrueba = tprueba;
    this.selectedTPRow = index;
  }

  clearAtributes() {
    this.tipoDevice = '';
    this.tipoPrueba = undefined;
    this.enchufe_idDevice = '';
  }

  clearAtributesTP() {
    this.nombreTipoPrueba = '';
    this.tipoDeviceTP = '';
  }

  createGrafic() {
    let intervalos: IntervaloPrueba[] = this.selected_pConsumo?.prueba.intervaloPrueba!;
    let consumos = intervalos.map(inter => inter.consumo);

    let dataBar = {
      type: 'bar',
      data: {
        labels: intervalos,
        datasets: [
          {
            label: 'Intervalos de consumo',
            data: consumos,
          },
        ],
      },
    };
    
    // Si el gráfico existe se borra la instancia.
    if(this.grafico != undefined){
      this.grafico.update(dataBar.data)
    } else {
      this.grafico = new Chart(document.getElementById('bar-chart') as HTMLCanvasElement, dataBar);
    }
  }

}
