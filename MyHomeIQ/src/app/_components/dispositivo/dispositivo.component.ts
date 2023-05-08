import { Component } from '@angular/core';
import { DispositivoService } from '../../_services/dispositivo.service';
import { Device } from '../../_models/device';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.component.html',
  styleUrls: ['./dispositivo.component.css']
})

export class DispositivoComponent {

  ngOnInit(): void {
  }

  constructor() { }

}




