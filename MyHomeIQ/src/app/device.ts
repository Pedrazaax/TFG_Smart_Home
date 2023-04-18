export class Device {
    idDevice: string;
    key: string;
    commands: { code: string; value: boolean | number }[];

    constructor(idDevice: string, key: string, commands: { code: string; value: boolean | number }[]) {
        this.idDevice = idDevice;
        this.key = key;
        this.commands = commands;
    }
}
