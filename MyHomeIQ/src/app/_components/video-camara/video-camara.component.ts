import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { DispositivoService } from 'src/app/_services/dispositivo.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Hls from 'hls.js'
import { NvdapiService } from 'src/app/_services/nvdapi.service';

@Component({
  selector: 'app-video-camara',
  templateUrl: './video-camara.component.html',
  styleUrls: ['./video-camara.component.css']
})

export class VideoCamaraComponent {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  camaras?: Device[];
  valor: any
  videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  numValue: any = -1;
  dangerousvideoUrl: any;
  hls: Hls = new Hls;

  activeCamara: string = '';

  editName: boolean = false;
  editModel: boolean = false;
  activeContent: string = '';
  vulnerabilities: any = '';

  selectedCve: any;
  responseNVD: any;

  constructor(private deviceService: DispositivoService, private nvdService:NvdapiService ,private toastr: ToastrService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.listarDevices()
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.camaras = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'Smart Camera');
      this.updateStates();
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
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

    this.deviceService.statusDevices(idDevices).subscribe(respuesta => {
      //console.log("Estados: ", respuesta)
    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })

  }

  delete(idDevice: string) {
    this.deviceService.deleteDevice(idDevice).subscribe(respuesta => {
      //console.log(respuesta)
      this.toastr.success("Dispositivo eliminado", "Éxito")
    }, error => {
      this.toastr.error(error.error.detail, "Error")
    })
  }

  toggleVideo() {
    this.activeCamara = '';
  }

  ajustes(idDevice: string) {

    if (this.activeContent == 'ajustes' && this.activeCamara == idDevice){
      this.activeContent = ''
    } else {
      this.activeContent = 'ajustes';
      this.activeCamara = idDevice;
    }

  }

  info(idDevice: string) {
    if (this.activeContent == 'info' && this.activeCamara == idDevice){
      this.activeContent = ''
    } else {
      this.activeContent = 'info';
      this.activeCamara = idDevice;
    }

  }

  seguridad(device: Device) {
    if (this.activeContent == 'seguridad' && this.activeCamara == device.idDevice){
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
