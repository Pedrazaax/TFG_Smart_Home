import { Component, ElementRef, Input, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { Estados } from 'src/app/_models/estados';
import { Jso } from 'src/app/_models/jso';
import { DispositivoService } from 'src/app/_services/dispositivo.service';
import { NvdapiService } from 'src/app/_services/nvdapi.service';
import { Room } from 'src/app/_models/room';
import { RoomService } from 'src/app/_services/room.service';
import { DeviceFilterService } from 'src/app/_services/devicefilter.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bulb',
  templateUrl: './bulb.component.html',
  styleUrls: ['./bulb.component.css']
})
export class BulbComponent {
  @ViewChildren('circle') circleRefs!: QueryList<ElementRef<SVGElement>>;
  @Input() devices?: Device[];

  bombillas?: Device[];
  valor: any
  numValue: any = -1;
  color?: string

  switch_led: Jso = {};
  work_mode: Jso = {};
  bright_value_v2: Jso = {};
  temp_value_v2: Jso = {};
  colour_data_v2: Jso = {};
  rgb: Jso = {};
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

  hsv: any;

  editName: boolean = false;
  editModel: boolean = false;
  activeContent: string = '';
  activeBulb: string = '';
  vulnerabilities: any = '';

  selectedCve: any;
  responseNVD: any;

  rooms: Room[] = []

  commonClasses = 'px-4 py-2 rounded hover:bg-blue-800 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50 transition-all duration-200';

  constructor(private deviceService: DispositivoService, private toastr: ToastrService, 
    private nvdService: NvdapiService, private roomService: RoomService, 
    private deviceFilter: DeviceFilterService, private router: Router) {
  }

  ngOnInit(): void {
    this.listarDevices()
    this.listarRooms()
  }

  listarRooms() {
    this.roomService.listarRooms().subscribe((respuesta: any[]) => {
      this.rooms = respuesta
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    );
  }

  setRoom(device: Device, room: Room) {
    this.roomService.setRoom(device, room).subscribe((response: any) => {
      this.toastr.success('Dispositivo modificado', 'Éxito');
      // Actualizar room en el dispositivo
      device.room = room;
      this.listarDevices();
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error");
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['devices']) {
      this.bombillas = changes['devices'].currentValue;
      
      if (this.bombillas) {
        this.bombillas = this.devices?.filter((dispositivo) => dispositivo.tipoDevice === 'Light Source');
        this.updateStates();
      }
      
    }
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.bombillas = this.deviceFilter.getFilteredDevices().filter((dispositivo) => dispositivo.tipoDevice === 'Light Source');
      this.updateStates();
    },
      (error: any) => {
        this.router.navigate(['/intro'])
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  updateInfo(device: Device) {
    this.deviceService.updateNameModel(device).subscribe(respuesta => {
      this.toastr.success('Dispositivo modificado', 'Éxito')
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  updateColor(color: any, valorKey: string, dispositivo: Device) {
    let match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  
    let r = parseInt(match[1]);
    let g = parseInt(match[2]);
    let b = parseInt(match[3]);

    let circleId = 'circle-' + dispositivo.idDevice;
    let circleRef = this.circleRefs.find(ref => ref.nativeElement.id === circleId);
    if (circleRef) {
      let circle = circleRef.nativeElement;
      circle.setAttribute('fill', color);
    }

    this.hsv = this.rgbToHsv(r,g,b)
    this.valor ={
      "h": this.hsv[0],
      "s": this.hsv[1],
      "v": this.hsv[2]
    }

    this.valor = JSON.stringify(this.valor)

    dispositivo.key = valorKey
    dispositivo.commands = [
      {
        code: valorKey,
        value: this.valor
      }
    ]

    this.deviceService.updateDevice(dispositivo).subscribe(respuesta => {
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
    
  }

  rgbToHsv(r: number, g: number, b: number): [number, number, number] {
    let max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h = 0,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return [Math.round(h * 360), Math.round(s * 1000), Math.round(v * 1000)];
  }

  hsvToRgb(h: number, s: number, v: number, bombilla: Device): [number, number, number] {
    h /= 360;
    s /= 1000;
    v /= 1000;
  
    let r = 0, g = 0, b = 0;
    if (s === 0) {
      r = v;
      g = v;
      b = v;
    } else {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
  
      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }
    }
    
    let rgbNUM = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]

    this.rgb[bombilla.idDevice] = 'rgb('+rgbNUM[0]+','+rgbNUM[1]+','+rgbNUM[2]+')'

    this.updateColor(this.rgb[bombilla.idDevice], 'color_value_v2', bombilla)

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  updateDevice(event: Event, valorKey: string, dispositivo: Device) {
    this.valor = (event.target as HTMLInputElement)?.checked;
    this.numValue = (event.target as HTMLInputElement)?.value;

    this.control_value();

    dispositivo.key = valorKey
    dispositivo.commands = [
      {
        code: valorKey,
        value: this.valor
      }
    ]

    this.deviceService.updateDevice(dispositivo).subscribe(respuesta => {
      this.toastr.success('Dispositivo modificado', 'Éxito')

      if (valorKey == 'switch_led'){
        let circleId = 'circle-' + dispositivo.idDevice;
        let circleRef = this.circleRefs.find(ref => ref.nativeElement.id === circleId);
        if (circleRef) {
          let circle = circleRef.nativeElement;
          circle.setAttribute('fill', 'rgb(255,255,255)');
        }
      }
      
      setTimeout(() => {
        this.updateState(dispositivo.idDevice);
      }, 2500);
      
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  private control_value() {
    if (this.numValue != "on") {
      this.valor = this.numValue;
    }
  }

  updateState(idDevice: string) {
    this.deviceService.statusDevice(idDevice).subscribe(respuesta => {
      let estados: Device["commands"] = respuesta

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
      if (respuesta.result) {
        respuesta.result.forEach(element => {
          idDevices.forEach(idDevice => {
            if (element.id == idDevice) {
              this.updateValues(idDevice, element.status);
            }
          });
        });
      }
    }, error => {
      this.toastr.error(error.error.detail, "Error");
    });

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
      this.hsv = JSON.parse(this.colour_data_v2[idDevice])
      let bulb = this.bombillas!.find(device => device.idDevice === idDevice);
      this.hsvToRgb(this.hsv["h"],this.hsv["s"],this.hsv["v"], bulb!)
    }

    //Code scene_data_v2 -- NO IMPLEMENTADO
    let sceneDataItem = respuesta.filter(item => item.code === 'scene_data_v2');
    if (sceneDataItem[0]) {
      let sceneData = sceneDataItem[0].value;
      this.scene_data_v2[idDevice] = sceneData;
    }

    //Code count down -- NO IMPLEMENTADO
    let countDownItem = respuesta.filter(item => item.code === 'countdown_1');

    if (countDownItem[0]) {
      let countDownValue = countDownItem[0].value;
      this.countdown_1[idDevice] = countDownValue;
    }

    //Code music_data -- NO IMPLEMENTADO
    let musicDataItem = respuesta.filter(item => item.code === 'music_data');
    if (musicDataItem[0]) {
      let musicData = musicDataItem[0].value;
      this.music_data[idDevice] = musicData;
    }

    //Code control_data -- NO IMPLEMENTADO
    let controlDataItem = respuesta.filter(item => item.code === 'control_data');
    if (controlDataItem[0]) {
      let controlData = controlDataItem[0].value;
      this.control_data[idDevice] = controlData;
    }

    //Code rhythm_mode -- NO IMPLEMENTADO
    let rhythmModeItem = respuesta.filter(item => item.code === 'rhythm_mode');
    if (rhythmModeItem[0]) {
      let rhythmMode = rhythmModeItem[0].value;
      this.rhythm_mode[idDevice] = rhythmMode;
    }

    //Code sleep_mode -- NO IMPLEMENTADO
    let sleepModeItem = respuesta.filter(item => item.code === 'sleep_mode');
    if (sleepModeItem[0]) {
      let sleepMode = sleepModeItem[0].value;
      this.sleep_mode[idDevice] = sleepMode;
    }

    //Code wakeup_mode -- NO IMPLEMENTADO
    let wakeupModeItem = respuesta.filter(item => item.code === 'wakeup_mode');
    if (wakeupModeItem[0]) {
      let wakeupMode = wakeupModeItem[0].value;
      this.wakeup_mode[idDevice] = wakeupMode;
    }

    //Code power_memory -- NO IMPLEMENTADO
    let powerMemoryItem = respuesta.filter(item => item.code === 'power_memory');
    if (powerMemoryItem[0]) {
      let powerMemory = powerMemoryItem[0].value;
      this.power_memory[idDevice] = powerMemory;
    }

    //Code do_not_disturb -- NO IMPLEMENTADO
    let doNotDisturbItem = respuesta.filter(item => item.code === 'do_not_disturb');
    if (doNotDisturbItem[0]) {
      let doNotDisturb = doNotDisturbItem[0].value;
      this.do_not_disturb[idDevice] = doNotDisturb;
    }

    //Code cycle_timing -- NO IMPLEMENTADO
    let cycleTimingItem = respuesta.filter(item => item.code === 'cycle_timing');
    if (cycleTimingItem[0]) {
      let cycleTiming = cycleTimingItem[0].value;
      this.cycle_timing[idDevice] = cycleTiming;
    }

    //Code random_timing -- NO IMPLEMENTADO
    let randomTimingItem = respuesta.filter(item => item.code === 'random_timing');
    if (randomTimingItem[0]) {
      let randomTiming = randomTimingItem[0].value;
      this.random_timing[idDevice] = randomTiming;
    }

  }


  delete(idDevice: string) {
    this.deviceService.deleteDevice(idDevice).subscribe(respuesta => {
      this.toastr.success("Dispositivo eliminado", "Éxito")
      this.listarDevices()
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
    this.activeBulb = '';
  }

  ajustes(idDevice: string) {

    if (this.activeContent == 'ajustes' && this.activeBulb == idDevice){
      this.activeContent = ''
    } else {
      this.activeContent = 'ajustes';
      this.activeBulb = idDevice;
    }

  }

  colores(idDevice: string) {
    if (this.activeContent == 'color' && this.activeBulb == idDevice){
      this.activeContent = ''
    } else {
      this.activeContent = 'color';
      this.activeBulb = idDevice;
    }
  }

  info(idDevice: string) {
    if (this.activeContent == 'info' && this.activeBulb == idDevice){
      this.activeContent = ''
    } else {
      this.activeContent = 'info';
      this.activeBulb = idDevice;
    }

  }

  room(idDevice: string) {
    if (this.activeContent == 'room' && this.activeBulb == idDevice){
      this.activeContent = ''
    } else {
      this.activeContent = 'room';
      this.activeBulb = idDevice;
    }

  }

  seguridad(device: Device) {
    if (this.activeContent == 'seguridad' && this.activeBulb == device.idDevice){
      this.activeContent = ''
    } else {
      this.activeContent = 'seguridad';
      this.activeBulb = device.idDevice;
      this.nvd(device);
    }
  }

  nvd(device: Device) {
    let keyword = device.tipoDevice + device.model;

    if (this.vulnerabilities == '') {
      this.nvdService.searchVulnerabilities(keyword).subscribe(
        (respuesta) => {
          this.responseNVD = respuesta;
          this.vulnerabilities = this.responseNVD.vulnerabilities;

          const vulns = this.vulnerabilities;

          // Agrupar vulnerabilidades por nivel de severidad
          const groupedVulns = vulns.reduce((acc: any, vuln: any) => {
            let severity;
            if (vuln.cve.metrics.cvssMetricV2) {
              severity = vuln.cve.metrics.cvssMetricV2[0].baseSeverity;
            } else if (vuln.cve.metrics.cvssMetricV31) {
              severity = vuln.cve.metrics.cvssMetricV31[0].cvssData.baseSeverity;
            }
            if (!acc[severity]) {
              acc[severity] = [];
            }
            acc[severity].push(vuln);
            return acc;
          }, {});

          // Crear array de vulnerabilidades con el formato adecuado
          this.vulnerabilities = Object.keys(groupedVulns).map((key) => ({
            baseSeverity: key,
            count: groupedVulns[key].length,
            cves: groupedVulns[key],
          }));

        },
        (error: any) => {
          this.toastr.error(error.error.detail, 'Error');
        }
      );
    }
  }

  getCircleSize(count: number) {
    // Establecer tamaño mínimo y máximo
    const minSize = 50;
    const maxSize = 150;

    // Calcular tamaño del círculo
    let size = count * 10;
    if (size < minSize) {
      size = minSize;
    } else if (size > maxSize) {
      size = maxSize;
    }

    return size + 'px';
  }

  getDescription(cve: any) {
    let description = cve.cve.descriptions.find((desc: any) => desc.lang === 'es');
    if (!description) {
      description = cve.cve.descriptions.find((desc: any) => desc.lang === 'en');
    }
    return description ? description.value : '';
  }
  
  selectCve(cve: any) {
    this.selectedCve = cve;
  }

  deselectCve() {
    this.selectedCve = null;
  }

}
