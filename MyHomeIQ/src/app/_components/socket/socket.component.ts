import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { Estados } from 'src/app/_models/estados';
import { Jso } from 'src/app/_models/jso';
import { DispositivoService } from 'src/app/_services/dispositivo.service';

@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.css']
})
export class SocketComponent {
  sockets?: Device[];
  valor?:any

  switch_1: Jso = {};
  countdown_1: Jso = {};
  add_ele: Jso = {};
  cur_current: Jso = {};
  cur_power: Jso = {};
  cur_voltage: Jso = {};
  relay_status: Jso = {};
  light_mode: Jso = {};
  child_lock: Jso = {};

  showEnchufes: boolean = false;

  constructor (private DeviceService: DispositivoService, private deviceService:DispositivoService, private toastr:ToastrService){

  }

  ngOnInit(): void {
    this.listarDevices()
  }

  listarDevices(){
    this.DeviceService.listarDevices().subscribe(respuesta => {
      this.sockets = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'Socket');;
      this.updateStates();
    },
      (error: any) => {
        alert("Error" + error.error.message)
      }
    )
  }

  updateDevice(event: Event, valorKey: string, dispositivo: Device) {
    this.valor = (event.target as HTMLInputElement)?.checked;

    dispositivo.key = valorKey
    dispositivo.commands = [
      {
        code: valorKey,
        value: this.valor
      }
    ]

    this.deviceService.updateDevice(dispositivo).subscribe(respuesta => {
      //console.log(respuesta)
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  delete(idDevice:string){
    this.deviceService.deleteDevice(idDevice).subscribe(respuesta =>{
      console.log(respuesta)
      this.toastr.success("Dispositivo eliminado", "Éxito")
    }, error =>{
      this.toastr.error(error.error.detail, "Error")
    })
  }

  updateState(idDevice: string) {
    this.deviceService.statusDevice(idDevice).subscribe(respuesta => {
      let estados: Device["commands"] = respuesta

      console.log('Estado de id: ', idDevice, ' Estado: ', respuesta)

      estados.forEach(element => {
        element.value = this.lowerLetters(element.value)
      });

      this.updateValues(idDevice, estados);
    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })
  }

  updateStates() {
    let idDevices = this.sockets!.map(device => device.idDevice);

    this.deviceService.statusDevices(idDevices).subscribe((respuesta: Estados) => {

      respuesta.result.forEach(element => {
        idDevices.forEach(idDevice => {
          if (element.id == idDevice) {
            console.log('Estado de id: ', idDevice, ' Estado: ', element.status)
            this.updateValues(idDevice, element.status)
          }
        });

      });

    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })

  }

  updateValues(idDevice: string, respuesta: Device["commands"]) {
    
    //Code switch
    let switchItem = respuesta.filter(item => item.code === 'switch_1');

    if (switchItem[0]) {
      let switchValue = switchItem[0].value;
      this.switch_1[idDevice] = switchValue;
    }

    //Code count down
    let countDownItem = respuesta.filter(item => item.code === 'countdown_1');

    if (countDownItem[0]) {
      let countDownValue = countDownItem[0].value;
      this.countdown_1[idDevice] = countDownValue;
    }

    //Code add ele
    let addeItem = respuesta.filter(item => item.code === 'add_ele');

    if (addeItem[0]) {
      let addeValue = addeItem[0].value;
      this.add_ele[idDevice] = addeValue;
    }

    //Code cur_current
    let curItem = respuesta.filter(item => item.code === 'cur_current');

    if (curItem[0]) {
      let curValue = curItem[0].value;
      this.cur_current[idDevice] = curValue;
    }

    //Code cur_power
    let powerItem = respuesta.filter(item => item.code === 'cur_power');

    if (powerItem[0]) {
      let powerValue = powerItem[0].value;
      this.cur_power[idDevice] = powerValue;
    }

    //Code cur_voltage
    let voltItem = respuesta.filter(item => item.code === 'cur_voltage');

    if (voltItem[0]) {
      let voltValue = voltItem[0].value;
      this.cur_voltage[idDevice] = voltValue;
    }

    //Code relay_status
    let relayItem = respuesta.filter(item => item.code === 'relay_status');

    if (relayItem[0]) {
      let relayValue = relayItem[0].value;
      this.relay_status[idDevice] = relayValue;
    }

    //Code light_mode
    let lightItem = respuesta.filter(item => item.code === 'light_mode');

    if (lightItem[0]) {
      let lightValue = lightItem[0].value;
      this.light_mode[idDevice] = lightValue;
    }

    //Code child_lock
    let childItem = respuesta.filter(item => item.code === 'child_lock');

    if (childItem) {
      let childValue = childItem[0].value;
      this.child_lock[idDevice] = childValue;
    }

  }

  lowerLetters(switchValue: any): boolean {

    if (switchValue == "True") {
      return true
    } else if (switchValue == "False") {
      return false
    }

    return switchValue

  }

  toggleEnchufes() {
    this.showEnchufes = !this.showEnchufes;
  }


}
