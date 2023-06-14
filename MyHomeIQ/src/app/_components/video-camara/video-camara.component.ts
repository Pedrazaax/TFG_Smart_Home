import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { DispositivoService } from 'src/app/_services/dispositivo.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Hls from 'hls.js'

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

  constructor(private deviceService: DispositivoService, private toastr: ToastrService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.listarDevices()
  }

  listarDevices() {
    this.deviceService.listarDevices().subscribe(respuesta => {
      this.camaras = respuesta.filter((dispositivo) => dispositivo.tipoDevice === 'Camara');
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


}
