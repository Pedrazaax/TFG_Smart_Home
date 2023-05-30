import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { Estados } from 'src/app/_models/estados';
import { Jso } from 'src/app/_models/jso';
import { DispositivoService } from 'src/app/_services/dispositivo.service';

@Component({
  selector: 'app-bulb',
  templateUrl: './bulb.component.html',
  styleUrls: ['./bulb.component.css']
})
export class BulbComponent {

  bombillas?: Device[];
  valor: any
  numValue: any = -1;
  color?: string

  switch_led: Jso = {};
  work_mode: Jso = {};
  bright_value_v2: Jso = {};
  temp_value_v2: Jso = {};
  colour_data_v2: Jso = {};
  scene_data_v2: Jso = {};
  countdown_1: Jso = {};
  music_data: Jso = {};
  control_data: Jso = {};
  rhythm_mode: Jso = {};
  sleep_mode: Jso = {};
  wakeup_mode: Jso = {};
  power_memory: Jso = {};
  do_not_disturb: Jso = {};
  cycle_timing: Jso = {};
  random_timing: Jso = {};

  showBombillas: boolean = false;

  constructor(private deviceService: DispositivoService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.listarDevices()
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.bombillas = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'Bombilla');;
      this.updateStates()
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  updateColor(color: any, valorKey: string, dispositivo: Device) {

    console.log('rgb:', color)

    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    console.log('r: ', r, 'g', g, 'b', b)

    let hsv = this.rgb2hsv(r, g, b);

    this.valor = {
      "h": hsv[0],
      "s": hsv[1],
      "v": hsv[2]
    }

    console.log('valor: ', this.valor);

    dispositivo.key = valorKey
    dispositivo.commands = [
      {
        code: valorKey,
        value: {
          "h": hsv[0],
          "s": hsv[1],
          "v": hsv[2]
        }
      }
    ]

    this.deviceService.updateDevice(dispositivo).subscribe(respuesta => {
      console.log(respuesta)
      this.toastr.success('Dispositivo modificado', 'Éxito')
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )

  }

  // input: r,g,b in [0,1], out: h in [0,360) and s,v in [0,1]
  rgb2hsv(r: number, g: number, b: number): any {
    let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
    let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
    return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
  }

  updateDevice(event: Event, valorKey: string, dispositivo: Device) {
    console.log('id: ', dispositivo.idDevice, ' valorKey: ', valorKey, ' evento: ', event)
    this.valor = (event.target as HTMLInputElement)?.checked;
    this.numValue = (event.target as HTMLInputElement)?.value;

    this.control_value(valorKey);

    dispositivo.key = valorKey
    dispositivo.commands = [
      {
        code: valorKey,
        value: this.valor
      }
    ]

    this.deviceService.updateDevice(dispositivo).subscribe(respuesta => {
      console.log(respuesta)
      this.toastr.success('Dispositivo modificado', 'Éxito')
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  private control_value(valorKey: string) {
    if (this.numValue != "on") {
      this.valor = this.numValue;
    }
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
    let idDevices = this.bombillas!.map(device => device.idDevice);

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

    //Code switch_led
    let switchLedItem = respuesta.filter(item => item.code === 'switch_led');
    if (switchLedItem[0]) {
      let switchLedValue = switchLedItem[0].value;
      this.switch_led[idDevice] = switchLedValue;
    }

    //Code work_mode
    let workModeItem = respuesta.filter(item => item.code === 'work_mode');
    if (workModeItem[0]) {
      let workModeValue = workModeItem[0].value;
      this.work_mode[idDevice] = workModeValue;
    }

    //Code bright_value_v2
    let brightValueItem = respuesta.filter(item => item.code === 'bright_value_v2');
    if (brightValueItem[0]) {
      let brightValue = brightValueItem[0].value;
      this.bright_value_v2[idDevice] = brightValue;
    }

    //Code temp_value_v2
    let tempValueItem = respuesta.filter(item => item.code === 'temp_value_v2');
    if (tempValueItem[0]) {
      let tempValue = tempValueItem[0].value;
      this.temp_value_v2[idDevice] = tempValue;
    }

    //Code colour_data_v2
    let colourDataItem = respuesta.filter(item => item.code === 'colour_data_v2');
    if (colourDataItem[0]) {
      let colourData = colourDataItem[0].value;
      this.colour_data_v2[idDevice] = colourData;
    }

    //Code scene_data_v2
    let sceneDataItem = respuesta.filter(item => item.code === 'scene_data_v2');
    if (sceneDataItem[0]) {
      let sceneData = sceneDataItem[0].value;
      this.scene_data_v2[idDevice] = sceneData;
    }

    //Code count down
    let countDownItem = respuesta.filter(item => item.code === 'countdown_1');

    if (countDownItem[0]) {
      let countDownValue = countDownItem[0].value;
      this.countdown_1[idDevice] = countDownValue;
    }

    //Code music_data
    let musicDataItem = respuesta.filter(item => item.code === 'music_data');
    if (musicDataItem[0]) {
      let musicData = musicDataItem[0].value;
      this.music_data[idDevice] = musicData;
    }

    //Code control_data
    let controlDataItem = respuesta.filter(item => item.code === 'control_data');
    if (controlDataItem[0]) {
      let controlData = controlDataItem[0].value;
      this.control_data[idDevice] = controlData;
    }

    //Code rhythm_mode
    let rhythmModeItem = respuesta.filter(item => item.code === 'rhythm_mode');
    if (rhythmModeItem[0]) {
      let rhythmMode = rhythmModeItem[0].value;
      this.rhythm_mode[idDevice] = rhythmMode;
    }

    //Code sleep_mode
    let sleepModeItem = respuesta.filter(item => item.code === 'sleep_mode');
    if (sleepModeItem[0]) {
      let sleepMode = sleepModeItem[0].value;
      this.sleep_mode[idDevice] = sleepMode;
    }

    //Code wakeup_mode
    let wakeupModeItem = respuesta.filter(item => item.code === 'wakeup_mode');
    if (wakeupModeItem[0]) {
      let wakeupMode = wakeupModeItem[0].value;
      this.wakeup_mode[idDevice] = wakeupMode;
    }

    //Code power_memory
    let powerMemoryItem = respuesta.filter(item => item.code === 'power_memory');
    if (powerMemoryItem[0]) {
      let powerMemory = powerMemoryItem[0].value;
      this.power_memory[idDevice] = powerMemory;
    }

    //Code do_not_disturb
    let doNotDisturbItem = respuesta.filter(item => item.code === 'do_not_disturb');
    if (doNotDisturbItem[0]) {
      let doNotDisturb = doNotDisturbItem[0].value;
      this.do_not_disturb[idDevice] = doNotDisturb;
    }

    //Code cycle_timing
    let cycleTimingItem = respuesta.filter(item => item.code === 'cycle_timing');
    if (cycleTimingItem[0]) {
      let cycleTiming = cycleTimingItem[0].value;
      this.cycle_timing[idDevice] = cycleTiming;
    }

    //Code random_timing
    let randomTimingItem = respuesta.filter(item => item.code === 'random_timing');
    if (randomTimingItem[0]) {
      let randomTiming = randomTimingItem[0].value;
      this.random_timing[idDevice] = randomTiming;
    }

  }


  delete(idDevice: string) {
    this.deviceService.deleteDevice(idDevice).subscribe(respuesta => {
      console.log(respuesta)
      this.toastr.success("Dispositivo eliminado", "Éxito")
    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })
  }

  lowerLetters(switchValue: any): boolean {

    if (switchValue == "True") {
      return true
    } else if (switchValue == "False") {
      return false
    }

    return switchValue

  }

  toggleBombillas() {
    this.showBombillas = !this.showBombillas;
  }



}
