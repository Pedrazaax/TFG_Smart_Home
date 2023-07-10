import { Component, AfterViewInit } from '@angular/core';
import { Chart, initTE } from 'tw-elements';

initTE({ Chart });

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.css']
})
export class ConsumoComponent {
  ngOnInit() {
    const dataBar = {
      type: 'bar',
      data: {
        labels: ['Monday', 'Tuesday' , 'Wednesday' , 'Thursday' , 'Friday' , 'Saturday' , 'Sunday '],
        datasets: [
          {
            label: 'Traffic',
            data: [2112, 2343, 2545, 3423, 2365, 1985, 987],
          },
        ],
      },
    };
  
    new Chart(document.getElementById('bar-chart') as HTMLCanvasElement, dataBar);
  }
}
