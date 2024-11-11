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

    constructor(private consumoService: ConsumoService, private toastr: ToastrService) {

    }
    ngOnInit() {
        this.get_dispositivosSimulador();
    }

    get_dispositivosSimulador() {
        this.consumoService.getSimuladorDispositivos().subscribe(
            (response: any) => {
                this.consumoDispositivos = response
                console.log(this.consumoDispositivos)
            },
            (error: any) => {
                this.toastr.error(error.error.detail, "Error")
            }
        );
    }
}