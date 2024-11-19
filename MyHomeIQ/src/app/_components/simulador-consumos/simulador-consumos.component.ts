import {Component} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SimuladorDispositivo } from 'src/app/_models/prueba-consumo';
import { ConsumoService } from 'src/app/_services/consumo.service';

@Component({
    selector: 'app-simulador-consumos',
    templateUrl: './simulador-consumos.component.html',
    styleUrls: ['./simulador-consumos.component.css']
})
export class SimuladorConsumosComponent {

    consumoDispositivos!: SimuladorDispositivo[]
    consumoDiario!: number
    consumoMensual!: number
    consumoAnual!: number
    intensidadDiaria!: number
    intensidadMensual!: number
    intensidadAnual!: number
    potenciaDiaria!: number
    potenciaMensual!: number
    potenciaAnual!: number
    etiquetaGlobal!: string
    dispositivoSeleccionado!: SimuladorDispositivo;

    constructor(private consumoService: ConsumoService, private toastr: ToastrService) {

    }
    ngOnInit() {
        this.get_dispositivosSimulador();
    }

    get_dispositivosSimulador() {
        this.consumoService.getSimuladorDispositivos().subscribe(
            (response: any) => {
                this.consumoDispositivos = response
                this.get_consumosGlobales();
                this.get_etiquetaGlobal();
                console.log(this.consumoDispositivos)
            },
            (error: any) => {
                this.toastr.error(error.error.detail, "Error")
            }
        );
    }

    get_consumosGlobales() {
        let consumoGlogal = 0;
        let intensidadGlobal = 0;
        let potenciaGlobal = 0;
        for (let dispositivo of this.consumoDispositivos) {
            consumoGlogal += parseFloat(dispositivo.consumoMedio)
            intensidadGlobal += parseFloat(dispositivo.intensidadMedia)
            potenciaGlobal += parseFloat(dispositivo.potenciaMedia)
        }
        this.consumoDiario = consumoGlogal;
        this.consumoMensual = this.consumoDiario * 31
        this.consumoAnual = this.consumoMensual * 12
        this.intensidadDiaria = intensidadGlobal;
        this.intensidadMensual = this.intensidadDiaria * 31
        this.intensidadAnual = this.intensidadMensual * 12
        this.potenciaDiaria = potenciaGlobal
        this.potenciaMensual = this.potenciaDiaria * 31
        this.potenciaAnual = this.potenciaMensual * 12
        console.log("Consumo diario: " + this.consumoDiario + " // Consumo mensual: " + this.consumoMensual + " // Consumo anual. " + this.consumoAnual)
        console.log("Intensidad diaria: " + this.intensidadDiaria + " // Intensidad mensual: " + this.intensidadMensual + " // Intensidad anual. " + this.intensidadAnual)
        console.log("Potencia diaria: " + this.potenciaDiaria + " // Potencia mensual: " + this.potenciaMensual + " // Potencia anual. " + this.potenciaAnual)
    }

    get_etiquetaGlobal() {
        const etiquetaValores: { [key: string]: number } = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 };
        const etiquetas = this.consumoDispositivos.map(d => etiquetaValores[d.etiqueta]);
    
        const mediaNumerica = etiquetas.reduce((a, b) => a + b, 0) / etiquetas.length;
        const valorRedondeado = Math.round(mediaNumerica);
    
        // Invertimos el objeto para obtener la etiqueta correspondiente al valor redondeado
        const valorEtiquetas = Object.keys(etiquetaValores).find(key => etiquetaValores[key] === valorRedondeado);
        this.etiquetaGlobal = valorEtiquetas || 'Error'; // En caso de error, asignamos 'G' por defecto
      }

      getEtiquetaClase(etiqueta: string): string {
        return `etiqueta-${etiqueta}`;
      }

    update_consumos() {
        this.consumoService.updateSimuladorDispositivos().subscribe(
            (response) => {
                this.consumoDispositivos = response
                this.get_consumosGlobales()
                this.get_etiquetaGlobal()
            },
            (error: any) => {
                this.toastr.error(error.error.detail, 'Error');
                console.log(error);
              }
        )
    }
    addDispositivo() {
        if (this.dispositivoSeleccionado) {
          console.log('Dispositivo seleccionado:', this.dispositivoSeleccionado.device);
        } else {
          console.log('No se ha seleccionado ningún dispositivo');
        }
    }
}