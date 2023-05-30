import { Device } from "./device";

export class Estados {
    result: [{
        id: string,
        status: Device["commands"]
    }];
    success: boolean;
    t: number;
    tid: string;

    constructor(result:any, success:boolean, t:number, tid:string){
        this.result= result;
        this.success=success;
        this.t=t;
        this.tid=tid;
    }
}
