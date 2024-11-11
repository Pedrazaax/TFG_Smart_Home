import {Component} from '@angular/core';
import { SimuladorDispositivo } from 'src/app/_models/prueba-consumo';

@Component({
    selector: 'app-simulador-consumos',
    templateUrl: './simulador-consumos.component.html',
    styleUrls: ['./simulador-consumos.component.css']
})
export class SimuladorConsumosComponent {
    consumoDispositivos!: SimuladorDispositivo[]
    constructor() {}
    ngOnInit() {}
}