import {Component} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SimuladorDispositivo } from 'src/app/_models/prueba-consumo';
import { ConsumoService } from 'src/app/_services/consumo.service';
import { NvdapiService } from 'src/app/_services/nvdapi.service';

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
    dispositivosSeleccionados: { device: string; estados: string[]; estado: string; duracion: number }[] = [];
    simuladorConsumoDiario!: number;
    simuladorConsumoMensual!: number;
    simuladorConsumoAnual!: number;
    simuladorIntensidadDiaria!: number;
    simuladorIntensidadMensual!: number;
    simuladorIntensidadAnual!: number;
    simuladorPotenciaDiaria!: number;
    simuladorPotenciaMensual!: number;
    simuladorPotenciaAnual!: number;

    responseNVD!: any;
    vulnerabilities!: any;



    constructor(private consumoService: ConsumoService, private toastr: ToastrService, private nvdapiService: NvdapiService) {

    }
    ngOnInit() {
        this.get_dispositivosSimulador();
        this.getSecurity();
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
        this.consumoDiario = consumoGlogal * 24
        this.consumoMensual = this.consumoDiario * 31
        this.consumoAnual = this.consumoMensual * 12
        this.intensidadDiaria = intensidadGlobal * 24
        this.intensidadMensual = this.intensidadDiaria * 31
        this.intensidadAnual = this.intensidadMensual * 12
        this.potenciaDiaria = potenciaGlobal * 24
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
            const estado = Array.isArray(this.dispositivoSeleccionado.estado)
                ? this.dispositivoSeleccionado.estado
                : [this.dispositivoSeleccionado.estado]; // Convertir a array si es string
    
            this.dispositivosSeleccionados.push({
                device: this.dispositivoSeleccionado.device,
                estados: estado, // Aseguramos que siempre sea un array
                estado: estado[0], // Estado inicial seleccionado
                duracion: 0 // El usuario lo llenará manualmente
            });
    
            this.dispositivoSeleccionado = undefined!; // Limpiamos la selección actual
        } else {
            this.toastr.warning('Por favor, selecciona un dispositivo antes de añadirlo.');
        }
    }    

    limpiarDispositivos() {
        this.dispositivosSeleccionados = [];
    }

    calcularConsumosSimulador() {
        if (this.dispositivosSeleccionados.length === 0) {
            this.toastr.warning('No hay dispositivos añadidos para calcular.');
            return;
        }
    
        // Variables para acumulación de consumos
        let consumoTotal = 0;
        let intensidadTotal = 0;
        let potenciaTotal = 0;
    
        // Iterar sobre los dispositivos seleccionados
        this.dispositivosSeleccionados.forEach((dispositivo) => {
            const duracion = dispositivo.duracion || 0; // Horas al día
            const dispositivoData = this.consumoDispositivos.find(d => d.device === dispositivo.device);
    
            if (dispositivoData) {
                const consumoMedio = parseFloat(dispositivoData.consumoMedio || '0'); // Consumo medio por hora
                const intensidadMedia = parseFloat(dispositivoData.intensidadMedia || '0'); // Intensidad media por hora
                const potenciaMedia = parseFloat(dispositivoData.potenciaMedia || '0'); // Potencia media por hora
    
                // Acumular los valores multiplicados por la duración (horas/día)
                consumoTotal += consumoMedio * duracion;
                intensidadTotal += intensidadMedia * duracion;
                potenciaTotal += potenciaMedia * duracion;
            }
        });
    
        // Calcular valores diarios, mensuales y anuales
        this.simuladorConsumoDiario = consumoTotal;
        this.simuladorConsumoMensual = consumoTotal * 31;
        this.simuladorConsumoAnual = this.simuladorConsumoMensual * 12;
    
        this.simuladorIntensidadDiaria = intensidadTotal;
        this.simuladorIntensidadMensual = intensidadTotal * 31;
        this.simuladorIntensidadAnual = this.simuladorIntensidadMensual * 12;
    
        this.simuladorPotenciaDiaria = potenciaTotal;
        this.simuladorPotenciaMensual = potenciaTotal * 31;
        this.simuladorPotenciaAnual = this.simuladorPotenciaMensual * 12;
    
        this.toastr.success('Cálculo basado en simulador realizado con éxito.');
    }

    getSecurity() {
        // climate.tuya_thermostat 
        // light.smart_bulb_tuya_1
        console.log("Buscando vulnerabilidades")
        this.nvdapiService.searchVulnerabilities('light').subscribe(
            (respuesta : any) => {
              console.log(respuesta);
              this.responseNVD = respuesta;
              this.vulnerabilities = this.responseNVD.vulnerabilities;
              console.log(this.vulnerabilities);
            },
            (error) => {
                this.toastr.error('Error al buscar vulnerabilidades', 'Error');
            }
        );

    }
}