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

export class TipoPruebaLocal {
    userName: string;
    name: string;
    category: string;
    device: string;
    intervalos: IntervaloLocal[];

    constructor(userName: string, name: string, category: string, device: string, intervalos: IntervaloLocal[]){
        this.userName = userName;
        this.name = name;
        this.category = category;
        this.device = device;
        this.intervalos = intervalos;
    }
}

export class IntervaloLocal {
    time: number;
    script: string;
    consumo?: number;
    current?: Array<number>;
    voltage?: Array<number>;
    power?: Array<number>;
    energy?: Array<number>;

    constructor(time: number, script: string){
        this.time = time;
        this.script = script;
    }
}

export class PruebaConsumoLocal {
    userName: string;
    name: string;
    category: string;
    device: string;
    tipoPrueba: TipoPruebaLocal;
    socket: string;
    timeTotal: number;
    consumoMedio: number;
    dateTime: string;

    constructor(userName: string, name: string, category: string, device: string,
         tipoPrueba: TipoPruebaLocal, socket: string, timeTotal: number,
          consumoMedio: number, dateTime: string){
        this.userName = userName;
        this.name = name;
        this.category = category;
        this.device = device;
        this.tipoPrueba = tipoPrueba;
        this.socket = socket;
        this.timeTotal = timeTotal;
        this.consumoMedio = consumoMedio;
        this.dateTime = dateTime;
    }
}

export class HomeAssistant {
    token: string;
    dominio: string;

    constructor(token: string, dominio: string) {
        this.token = token;
        this.dominio = dominio;
    }
}

export interface Status {
    code: string;
    value: any;
}
export class SimuladorDispositivo {
    deviceID: string;
    device: string;
    estado: string;
    consumoMedio: string;
    potenciaMedia: string;
    intensidadMedia: string;
    etiqueta: string;

    constructor(deviceID: string, device: string, estado: string, consumoMedio: string, potenciaMedia: string, intensidadMedia: string, etiqueta: string) {
        this.deviceID = deviceID;
        this.device = device;
        this.estado = estado;
        this.consumoMedio = consumoMedio;
        this.potenciaMedia = potenciaMedia;
        this.intensidadMedia = intensidadMedia;
        this.etiqueta = etiqueta;
    }

}