export class Device {
    id: string;
    name: string;
    idDevice: string;
    tipoDevice: string;
    key: string;
    commands: { code: string; value: any }[];
    online: boolean;
    create_time: number;
    update_time: number;
    ip: string;
    model: string;

    constructor(id:string, name:string, idDevice: string, tipoDevice: string, 
        key: string, commands: { code: string; value: any }[], online: boolean, 
        create_time: number, update_time: number, ip: string, model: string) {

        this.id = id;
        this.name = name;
        this.idDevice = idDevice;
        this.tipoDevice = tipoDevice;
        this.key = key;
        this.commands = commands;
        this.online = online;
        this.create_time = create_time;
        this.update_time = update_time;
        this.ip = ip;
        this.model = model;
        
    }
}