export class Device {
    id: string;
    name: string;
    idDevice: string;
    tipoDevice: string;
    key: string;
    commands: { code: string; value: any }[];

    constructor(id:string, name:string, idDevice: string, tipoDevice: string, key: string, commands: { code: string; value: any }[]) {
        this.id = id;
        this.name = name;
        this.idDevice = idDevice;
        this.tipoDevice = tipoDevice;
        this.key = key;
        this.commands = commands;
    }
}
