export class Device {
    id: string;
    idDevice: string;
    tipoDevice: string;
    key: string;
    commands: { code: string; value: boolean | number }[];

    constructor(id:string, idDevice: string, tipoDevice: string, key: string, commands: { code: string; value: boolean | number }[]) {
        this.id = id
        this.idDevice = idDevice;
        this.tipoDevice = tipoDevice;
        this.key = key;
        this.commands = commands;
    }
}
