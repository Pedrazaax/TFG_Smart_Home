export class PruebaConsumo {
    idPrueba?: string;
    tipoDevice: string;
    idDevice: string;
    prueba: TipoPrueba;
    idSocket: string;
    consumoMedio?: number;
    timeTotal?: number;

    constructor(tipoDevice: string, prueba: TipoPrueba, idDevice: string, socket: string) {
        this.tipoDevice = tipoDevice;
        this.prueba = prueba;
        this.idDevice = idDevice;
        this.idSocket = socket;
    }

}

export class TipoPrueba {
    idTipoPrueba!: string;
    intervaloPrueba: IntervaloPrueba[];
    nombre: string;
    tipoDevice: string;

    constructor(intervaloPrueba: IntervaloPrueba[], nombre: string, tipoDevice: string) {
        this.intervaloPrueba = intervaloPrueba;
        this.nombre = nombre;
        this.tipoDevice = tipoDevice;
    }
}

export class IntervaloPrueba {
    time: number;
    status: Status[];
    consumo?: number;

    constructor(time: number, status: Status[]){
        this.time = time;
        this.status = status;
    }
}

export interface Status {
    code: string;
    value: any;
}
