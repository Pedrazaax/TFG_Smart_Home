import { Component } from '@angular/core';

@Component({
  selector: 'app-termostato',
  templateUrl: './termostato.component.html',
  styleUrls: ['./termostato.component.css']
})
export class TermostatoComponent {
  isOn = false;

  toggle() {
    this.isOn = !this.isOn;
    // Aquí se puede agregar la lógica para enviar una solicitud al termostato wifi para cambiar su estado
  }
}
