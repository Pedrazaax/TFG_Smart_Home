import { Component, Input, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { Estados } from 'src/app/_models/estados';
import { Jso } from 'src/app/_models/jso';
import { Room } from 'src/app/_models/room';
import { DeviceFilterService } from 'src/app/_services/devicefilter.service';
import { DispositivoService } from 'src/app/_services/dispositivo.service';
import { NvdapiService } from 'src/app/_services/nvdapi.service';
import { RoomService } from 'src/app/_services/room.service';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent {
  @Input() devices?: Device[];

  alarmas?: Device[];
  valor:any;

  //Commands keys
  master_mode: Jso = {};
  delay_set: Jso = {};
  alarm_time: Jso = {};
  switch_alarm_sound: Jso = {};
  switch_alarm_light: Jso = {};
  switch_mode_sound: Jso = {};
  switch_kb_sound: Jso = {};
  switch_kb_light: Jso = {};
  muffling: Jso = {};
  switch_alarm_propel: Jso = {};
  alarm_delay_time: Jso = {};
  master_state: Jso = {};
  factory_reset: Jso = {};
  sub_class: Jso = {};

  showAlarma:boolean = false;

  editName:boolean = false;
  editModel:boolean = false;
  activeContent:string = '';
  activeAlarm:string = '';
  vulnerabilities: any = '';

  selectedCve: any;
  responseNVD: any;

  rooms: Room[] = [];
  commonClasses = 'px-4 py-2 rounded hover:bg-blue-800 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50 transition-all duration-200';

  constructor(private deviceService: DispositivoService, private toastr: ToastrService, 
    private deviceFilter: DeviceFilterService, private roomService: RoomService,
    private nvdService: NvdapiService){

  }

  ngOnInit(): void {
    this.listarDevices();
    this.listarRooms();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['devices']) {
      this.alarmas = changes['devices'].currentValue;
      if (this.alarmas) {
        this.alarmas = this.devices?.filter((dispositivo) => dispositivo.tipoDevice === 'Multifunctional Alarm');
        this.updateStates();
      }
    }
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.alarmas = this.deviceFilter.getFilteredDevices().filter((dispositivo) => dispositivo.tipoDevice === 'Multifunctional Alarm');
      console.log(this.alarmas)
      this.updateStates();
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
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

  room(idDevice: string) {
    if (this.activeContent == 'room' && this.activeAlarm == idDevice){
      this.activeContent = ''
    } else {
      this.activeContent = 'room';
      this.activeAlarm = idDevice;
    }
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
      this.listarDevices()
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  updateValues(idDevice: string, respuesta: Device["commands"]) {
    // Code master_mode
    let master_modeItem = respuesta.filter(item => item.code == "master_mode")

    if (master_modeItem[0]) {
      let master_modeValue = master_modeItem[0].value;
      this.master_mode[idDevice] = master_modeValue;
    }

    // Code delay_set
    let delay_setItem = respuesta.filter(item => item.code == "delay_set")

    if (delay_setItem[0]) {
      let delay_setValue = delay_setItem[0].value;
      this.delay_set[idDevice] = delay_setValue;
    }

    // Code alarm_time
    let alarm_timeItem = respuesta.filter(item => item.code == "alarm_time")

    if (alarm_timeItem[0]) {
      let alarm_timeValue = alarm_timeItem[0].value;
      this.alarm_time[idDevice] = alarm_timeValue;
    }

    // Code switch_alarm_sound
    let switch_alarm_soundItem = respuesta.filter(item => item.code == "switch_alarm_sound")

    if (switch_alarm_soundItem[0]) {
      let switch_alarm_soundValue = switch_alarm_soundItem[0].value;
      this.switch_alarm_sound[idDevice] = switch_alarm_soundValue;
    }

    // Code switch_alarm_light
    let switch_alarm_lightItem = respuesta.filter(item => item.code == "switch_alarm_light")

    if (switch_alarm_lightItem[0]) {
      let switch_alarm_lightValue = switch_alarm_lightItem[0].value;
      this.switch_alarm_light[idDevice] = switch_alarm_lightValue;
    }

    // Code switch_mode_sound
    let switch_mode_soundItem = respuesta.filter(item => item.code == "switch_mode_sound")

    if (switch_mode_soundItem[0]) {
      let switch_mode_soundValue = switch_mode_soundItem[0].value;
      this.switch_mode_sound[idDevice] = switch_mode_soundValue;
    }

    // Code switch_kb_sound
    let switch_kb_soundItem = respuesta.filter(item => item.code == "switch_kb_sound")

    if (switch_kb_soundItem[0]) {
      let switch_kb_soundValue = switch_kb_soundItem[0].value;
      this.switch_kb_sound[idDevice] = switch_kb_soundValue;
    }

    // Code switch_kb_light
    let switch_kb_lightItem = respuesta.filter(item => item.code == "switch_kb_light")

    if (switch_kb_lightItem[0]) {
      let switch_kb_lightValue = switch_kb_lightItem[0].value;
      this.switch_kb_light[idDevice] = switch_kb_lightValue;
    }

    // Code muffling
    let mufflingItem = respuesta.filter(item => item.code == "muffling")

    if (mufflingItem[0]) {
      let mufflingValue = mufflingItem[0].value;
      this.muffling[idDevice] = mufflingValue;
    }

    // Code switch_alarm_propel
    let switch_alarm_propelItem = respuesta.filter(item => item.code == "switch_alarm_propel")

    if (switch_alarm_propelItem[0]) {
      let switch_alarm_propelValue = switch_alarm_propelItem[0].value;
      this.switch_alarm_propel[idDevice] = switch_alarm_propelValue;
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
    let idDevices = this.alarmas!.map(device => device.idDevice);

    this.deviceService.statusDevices(idDevices).subscribe((respuesta: Estados) => {

      respuesta.result.forEach(element => {
        idDevices.forEach(idDevice => {
          if (element.id == idDevice) {
            this.updateValues(idDevice, element.status)
          }
        });

      });

    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })

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

  toggleAlarmas() {
    this.showAlarma = !this.showAlarma;
  }

  ajustes(idDevice: string) {

    if (this.activeContent == 'ajustes' && this.activeAlarm == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'ajustes';
      this.activeAlarm = idDevice;
    }

  }

  consumo(idDevice: string) {
    if (this.activeContent == 'consumo' && this.activeAlarm == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'consumo';
      this.activeAlarm = idDevice;
    }
  }

  info(idDevice: string) {
    if (this.activeContent == 'info' && this.activeAlarm == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'info';
      this.activeAlarm = idDevice;
    }

  }

  seguridad(device: Device) {
    if (this.activeContent == 'seguridad' && this.activeAlarm == device.idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'seguridad';
      this.activeAlarm = device.idDevice;
      this.nvd(device);
    }
  }

  nvd(device: Device) {
    let keyword = device.tipoDevice + device.model;

    if (this.vulnerabilities == '') {
      this.nvdService.searchVulnerabilities(keyword).subscribe(
        (respuesta) => {
          console.log(respuesta);
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

          console.log(this.vulnerabilities)

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

  updateInfo(device: Device) {
    this.deviceService.updateNameModel(device).subscribe(respuesta => {
      this.toastr.success('Dispositivo modificado', 'Éxito')
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

}
