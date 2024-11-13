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
}