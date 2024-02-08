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
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent {
  @Input() devices?: Device[];

  sensors?: Device[];
  valor?: any

  pir: Jso = {};
  pir_time: Jso = {};
  battery_percentage: Jso = {};

  editName: boolean = false;
  editModel: boolean = false;
  activeContent: string = '';
  activeSensor: string = '';
  vulnerabilities: any = '';

  selectedCve: any;
  responseNVD: any;

  rooms: Room[] = [];
  commonClasses = 'px-4 py-2 rounded hover:bg-blue-800 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50 transition-all duration-200';

  constructor(private deviceService: DispositivoService, private nvdService: NvdapiService,
    private toastr: ToastrService, private deviceFilter: DeviceFilterService,
    private roomService: RoomService) {

  }

  ngOnInit(): void {
    this.listarDevices()
    this.listarRooms()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['devices']) {
      this.sensors = changes['devices'].currentValue;

      if (this.sensors) {
        this.sensors = this.devices?.filter((dispositivo) => dispositivo.tipoDevice === 'Motion Detector');
        this.updateStates();
      }

    }
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.sensors = this.deviceFilter.getFilteredDevices().filter((dispositivo) => dispositivo.tipoDevice === 'Motion Detector');
      console.log(this.sensors)
      this.updateStates();
    },
      (error: any) => {
        alert("Error" + error.error.message)
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
    if (this.activeContent == 'room' && this.activeSensor == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'room';
      this.activeSensor = idDevice;
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

  delete(idDevice: string) {
    this.deviceService.deleteDevice(idDevice).subscribe(respuesta => {
      this.toastr.success("Dispositivo eliminado", "Éxito")
      this.listarDevices()
    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })
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
    let idDevices = this.sensors!.map(device => device.idDevice);

    this.deviceService.statusDevices(idDevices).subscribe((respuesta: Estados) => {

      console.log("Estados sensores: ", respuesta)
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

  updateValues(idDevice: string, respuesta: Device["commands"]) {

    //Code pir
    let pirItem = respuesta.filter(item => item.code === 'pir');

    if (pirItem[0]) {
      let pirValue = pirItem[0].value;
      this.pir[idDevice] = pirValue;
    }

    //Code pir_time
    let pirTimeItem = respuesta.filter(item => item.code === 'pir_time');

    if (pirTimeItem[0]) {
      let pirTimeValue = pirTimeItem[0].value;
      this.pir_time[idDevice] = pirTimeValue;
    }

    //Code battery_percentage
    let batteryItem = respuesta.filter(item => item.code === 'battery_percentage');

    if (batteryItem[0]) {
      let batteryValue = batteryItem[0].value;
      this.battery_percentage[idDevice] = batteryValue;
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

  toggleSensors() {
    this.activeSensor = '';
  }

  ajustes(idDevice: string) {

    if (this.activeContent == 'ajustes' && this.activeSensor == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'ajustes';
      this.activeSensor = idDevice;
    }

  }

  consumo(idDevice: string) {
    if (this.activeContent == 'consumo' && this.activeSensor == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'consumo';
      this.activeSensor = idDevice;
    }
  }

  info(idDevice: string) {
    if (this.activeContent == 'info' && this.activeSensor == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'info';
      this.activeSensor = idDevice;
    }

  }

  seguridad(device: Device) {
    if (this.activeContent == 'seguridad' && this.activeSensor == device.idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'seguridad';
      this.activeSensor = device.idDevice;
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
