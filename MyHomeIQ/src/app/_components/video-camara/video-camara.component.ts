import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { DispositivoService } from 'src/app/_services/dispositivo.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Hls from 'hls.js'
import { NvdapiService } from 'src/app/_services/nvdapi.service';
import { Estados } from 'src/app/_models/estados';
import { Jso } from 'src/app/_models/jso';
import { DeviceFilterService } from 'src/app/_services/devicefilter.service';
import { Room } from 'src/app/_models/room';
import { RoomService } from 'src/app/_services/room.service';

@Component({
  selector: 'app-video-camara',
  templateUrl: './video-camara.component.html',
  styleUrls: ['./video-camara.component.css']
})

export class VideoCamaraComponent {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @Input() devices?: Device[];

  camaras?: Device[];
  valor: any
  videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  numValue: any = -1;
  dangerousvideoUrl: any;
  hls: Hls = new Hls;

  // Variables para mostrar información de la cámara
  basic_indicator: Jso = {};
  basic_flip: Jso = {};
  basic_osd: Jso = {};
  basic_private: Jso = {};
  motion_sensitivity: Jso = {};
  basic_nightvision: Jso = {};
  sd_status: Jso = {};
  sd_format: Jso = {};
  ptz_control: Jso = {};
  motion_switch: Jso = {};
  record_switch: Jso = {};
  record_mode: Jso = {};
  motion_tracking: Jso = {};
  alarm_message: Jso = {};
  initiative_message: Jso = {};

  activeCamara: string = '';

  editName: boolean = false;
  editModel: boolean = false;
  activeContent: string = '';
  vulnerabilities: any = '';

  selectedCve: any;
  responseNVD: any;

  rooms: Room[] = [];
  commonClasses = 'px-4 py-2 rounded hover:bg-blue-800 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50 transition-all duration-200';

  constructor(private deviceService: DispositivoService, private nvdService: NvdapiService, 
    private toastr: ToastrService, private sanitizer: DomSanitizer, 
    private deviceFilter: DeviceFilterService, private roomService: RoomService) {

  }

  ngOnInit(): void {
    this.listarDevices()
    this.listarRooms()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['devices']) {
      this.camaras = changes['devices'].currentValue;
      
      if (this.camaras) {
        this.camaras = this.devices?.filter((dispositivo) => dispositivo.tipoDevice === 'Smart Camera');
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
    if (this.activeContent == 'room' && this.activeCamara == idDevice){
      this.activeContent = ''
    } else {
      this.activeContent = 'room';
      this.activeCamara = idDevice;
    }
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.camaras = this.deviceFilter.getFilteredDevices().filter((dispositivo) => dispositivo.tipoDevice === 'Smart Camera');
      this.updateStates();
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
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

  getURL(idDevice: string) {
    this.deviceService.videoStream(idDevice).subscribe(
      respuesta => {
        this.dangerousvideoUrl = respuesta;

        if (Hls.isSupported()) {
          this.hls = new Hls();
          this.hls.loadSource(this.dangerousvideoUrl.url);
          this.hls.attachMedia(this.video.nativeElement);
        } else if (this.video.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
          this.video.nativeElement.src = this.dangerousvideoUrl.url;
        }

        let boton = <HTMLButtonElement>document.getElementById(`boton${idDevice}`);
        boton.setAttribute('hidden', 'true');

      },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error");
      }
    );
  }

  verVideo(idDevice: string) {
    this.getURL(idDevice);
  }

  updateState(idDevice: string) {
    this.deviceService.statusDevice(idDevice).subscribe(respuesta => {
      //console.log("Estado: ", respuesta)
    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })
  }

  updateStates() {
    let idDevices = this.camaras!.map(device => device.idDevice);

    this.deviceService.statusDevices(idDevices).subscribe((respuesta: Estados) => {
      console.log("Estados: ", respuesta)
      
      respuesta.result.forEach(element => {
        idDevices.forEach(idDevice => {
          if (element.id == idDevice) {
            this.updateValues(idDevice, element.status)
          }
        });
      })
    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })
  }

  updateValues(idDevice: string, respuesta: Device["commands"]) {

    //Code  basic_indicator
    let basic_indicatorItem = respuesta.filter(item => item.code == 'basic_indicator')
    if (basic_indicatorItem[0]) {
      let basic_indicatorValue = basic_indicatorItem[0].value;
      this.basic_indicator[idDevice] = basic_indicatorValue;
    }

    //Code  basic_flip
    let basic_flipItem = respuesta.filter(item => item.code == 'basic_flip')
    if (basic_flipItem[0]) {
      let basic_flipValue = basic_flipItem[0].value;
      this.basic_flip[idDevice] = basic_flipValue;
    }

    //Code  basic_osd
    let basic_osdItem = respuesta.filter(item => item.code == 'basic_osd')
    if (basic_osdItem[0]) {
      let basic_osdValue = basic_osdItem[0].value;
      this.basic_osd[idDevice] = basic_osdValue;
    }

    //Code  basic_private
    let basic_privateItem = respuesta.filter(item => item.code == 'basic_private')
    if (basic_privateItem[0]) {
      let basic_privateValue = basic_privateItem[0].value;
      this.basic_private[idDevice] = basic_privateValue;
    }

    //Code  motion_sensitivity
    let motion_sensitivityItem = respuesta.filter(item => item.code == 'motion_sensitivity')
    if (motion_sensitivityItem[0]) {
      let motion_sensitivityValue = motion_sensitivityItem[0].value;
      this.motion_sensitivity[idDevice] = motion_sensitivityValue;
    }

    //Code  basic_nightvision
    let basic_nightvisionItem = respuesta.filter(item => item.code == 'basic_nightvision')
    if (basic_nightvisionItem[0]) {
      let basic_nightvisionValue = basic_nightvisionItem[0].value;
      this.basic_nightvision[idDevice] = basic_nightvisionValue;
    }

    //Code  sd_status
    let sd_statusItem = respuesta.filter(item => item.code == 'sd_status')
    if (sd_statusItem[0]) {
      let sd_statusValue = sd_statusItem[0].value;
      this.sd_status[idDevice] = sd_statusValue;
    }

    //Code  sd_format
    let sd_formatItem = respuesta.filter(item => item.code == 'sd_format')
    if (sd_formatItem[0]) {
      let sd_formatValue = sd_formatItem[0].value;
      this.sd_format[idDevice] = sd_formatValue;
    }

    //Code  ptz_control
    let ptz_controlItem = respuesta.filter(item => item.code == 'ptz_control')
    if (ptz_controlItem[0]) {
      let ptz_controlValue = ptz_controlItem[0].value;
      this.ptz_control[idDevice] = ptz_controlValue;
    }

    //Code  motion_switch
    let motion_switchItem = respuesta.filter(item => item.code == 'motion_switch')
    if (motion_switchItem[0]) {
      let motion_switchValue = motion_switchItem[0].value;
      this.motion_switch[idDevice] = motion_switchValue;
    }

    //Code  record_switch
    let record_switchItem = respuesta.filter(item => item.code == 'record_switch')
    if (record_switchItem[0]) {
      let record_switchValue = record_switchItem[0].value;
      this.record_switch[idDevice] = record_switchValue;
    }

    //Code  record_mode
    let record_modeItem = respuesta.filter(item => item.code == 'record_mode')
    if (record_modeItem[0]) {
      let record_modeValue = record_modeItem[0].value;
      this.record_mode[idDevice] = record_modeValue;
    }

    //Code  motion_tracking
    let motion_trackingItem = respuesta.filter(item => item.code == 'motion_tracking')
    if (motion_trackingItem[0]) {
      let motion_trackingValue = motion_trackingItem[0].value;
      this.motion_tracking[idDevice] = motion_trackingValue;
    }

    //Code  alarm_message
    let alarm_messageItem = respuesta.filter(item => item.code == 'alarm_message')
    if (alarm_messageItem[0]) {
      let alarm_messageValue = alarm_messageItem[0].value;
      this.alarm_message[idDevice] = alarm_messageValue;
    }

    //Code  initiative_message
    let initiative_messageItem = respuesta.filter(item => item.code == 'initiative_message')
    if (initiative_messageItem[0]) {
      let initiative_messageValue = initiative_messageItem[0].value;
      this.initiative_message[idDevice] = initiative_messageValue;
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

  toggleVideo() {
    this.activeCamara = '';
  }

  ajustes(idDevice: string) {

    if (this.activeContent == 'ajustes' && this.activeCamara == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'ajustes';
      this.activeCamara = idDevice;
    }

  }

  info(idDevice: string) {
    if (this.activeContent == 'info' && this.activeCamara == idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'info';
      this.activeCamara = idDevice;
    }

  }

  seguridad(device: Device) {
    if (this.activeContent == 'seguridad' && this.activeCamara == device.idDevice) {
      this.activeContent = ''
    } else {
      this.activeContent = 'seguridad';
      this.activeCamara = device.idDevice;
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
