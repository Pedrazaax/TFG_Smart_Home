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
import { Router } from '@angular/router'

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.component.html',
  styleUrls: ['./thermostat.component.css']
})

export class ThermostatComponent {
  @Input() devices?: Device[];

  termostatos?: Device[];
  valor: any;
  temperatureValue: any = -1;

  switch: Jso = {};
  child: Jso = {};
  eco: Jso = {};
  temp_set: Jso = {};
  upper_temp: Jso = {};

  switchON: boolean = false;

  activeContent = '';
  activeTermostato = '';

  responseNVD: any;
  vulnerabilities: any = '';

  selectedCve: any;

  editName: boolean = false;
  editModel: boolean = false;

  rooms: Room[] = [];
  commonClasses = 'px-4 py-2 rounded hover:bg-blue-800 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50 transition-all duration-200';

  constructor(private deviceService: DispositivoService, private nvdService: NvdapiService, 
    private toastr: ToastrService, private deviceFilter: DeviceFilterService, 
    private roomService: RoomService, private router: Router) {

  }

  ngOnInit(): void {
    this.listarDevices();
    this.listarRooms();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['devices']) {
      this.termostatos = changes['devices'].currentValue;
      
      if (this.termostatos) {
        this.termostatos = this.devices?.filter((dispositivo) => dispositivo.tipoDevice === 'Thermostat');
        this.updateStates();
      }
      
    }
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
    if (this.activeContent == 'room' && this.activeTermostato == idDevice){
      this.activeContent = ''
    } else {
      this.activeContent = 'room';
      this.activeTermostato = idDevice;
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

  getDescription(cve: any) {
    let description = cve.cve.descriptions.find((desc: any) => desc.lang === 'es');
    if (!description) {
      description = cve.cve.descriptions.find((desc: any) => desc.lang === 'en');
    }
    return description ? description.value : '';
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.termostatos = this.deviceFilter.getFilteredDevices().filter((dispositivo) => dispositivo.tipoDevice === 'Thermostat');
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

  updateDevice(event: Event, valorKey: string, dispositivo: Device) {
    this.valor = (event.target as HTMLInputElement)?.checked;
    this.temperatureValue = (event.target as HTMLInputElement)?.value;

    this.control_value();

    dispositivo.key = valorKey
    dispositivo.commands = [
      {
        code: valorKey,
        value: this.valor
      }
    ]

    if (this.switch[dispositivo.idDevice] == true || valorKey == 'switch') {
      this.deviceService.updateDevice(dispositivo).subscribe(respuesta => {
        this.toastr.success('Dispositivo modificado', 'Éxito')
      },
        (error: any) => {
          this.toastr.error(error.error.detail, "Error")
        }
      )
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

  updateValues(idDevice: string, respuesta: Device["commands"]) {

    //Code switch
    let switchItem = respuesta.filter(item => item.code === 'switch');

    if (switchItem) {
      let switchValue = switchItem[0].value;
      this.switch[idDevice] = switchValue;
    }

    //Code child_lock
    let childItem = respuesta.filter(item => item.code === 'child_lock');

    if (childItem) {
      let childValue = childItem[0].value;
      this.child[idDevice] = childValue;
    }

    //Code eco
    let ecoItem = respuesta.filter(item => item.code === 'eco');

    if (ecoItem[0]) {
      let ecoValue = ecoItem[0].value;
      this.eco[idDevice] = ecoValue;
    } else {
      this.eco[idDevice] = false;
    }

    //Code temp_set
    let temp_setItem = respuesta.filter(item => item.code === 'temp_set');

    if (temp_setItem) {
      let temp_setValue = temp_setItem[0].value;
      this.temp_set[idDevice] = temp_setValue;
    }

    //Code upper_temp
    let upper_tempItem = respuesta.filter(item => item.code === 'upper_temp');

    if (upper_tempItem) {
      let upper_tempValue = upper_tempItem[0].value;
      this.upper_temp[idDevice] = upper_tempValue;
    }

  }

  updateStates() {
    let idDevices = this.termostatos!.map(device => device.idDevice);

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

  private control_value() {
    if (this.temperatureValue != "on") {
      this.valor = this.temperatureValue;
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

  toggleTermostatos() {
    this.activeTermostato = '';
  }

  ajustes(idDevice: string) {

    if (this.activeContent == 'ajustes' && this.activeTermostato == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'ajustes';
      this.activeTermostato = idDevice;
    }

  }

  info(idDevice: string) {
    if (this.activeContent == 'info' && this.activeTermostato == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'info';
      this.activeTermostato = idDevice;
      console.log(this.activeTermostato)
    }

  }

  seguridad(device: Device) {
    if (this.activeContent == 'seguridad' && this.activeTermostato == device.idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'seguridad';
      this.activeTermostato = device.idDevice;
      this.nvd(device);
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

  selectCve(cve: any) {
    this.selectedCve = cve;
  }

  deselectCve() {
    this.selectedCve = null;
  }




}





