import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { HistorylogService } from 'src/app/_services/historylog.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.css'],
})
export class HistoryLogComponent {
  historyLogs: any[] = [];
  logbookEntries: any[] = [];
  filteredLogbookEntries: any[] = [];
  availableNames: string[] = [];
  selectedNameFilter: string = '';
  startDate: string = new Date().toISOString().slice(0, 16); // Fecha de inicio por defecto (hoy)
  endDate: string = new Date().toISOString().slice(0, 16); // Fecha de fin por defecto (hoy)
  graficoEntries: Chart | null = null;

  constructor(
    private historyLogService: HistorylogService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.handleDateChange(); // Llama inicialmente para cargar datos
  }

  // Método para manejar el cambio de fechas
  handleDateChange(): void {
    console.log('Fecha de inicio:', this.startDate);
    console.log('Fecha de fin:', this.endDate);

    if (!this.startDate) {
      console.warn('StartDate está vacío, no se llama a getLogbookEntries.');
      return;
    }

    //this.getHistoryLogs();
    this.getLogbookEntries();
  }

  // Método para obtener el historial de cambios de estado
  getHistoryLogs(): void {
    const entityIds = ['sensor.temperature', 'sensor.humidity']; // Cambia esto por los IDs de tus entidades
    this.historyLogService
      .getPeriod(this.startDate, this.endDate)
      .subscribe(
        (response: any) => {
          this.historyLogs = response;
        },
        (error: any) => {
          this.toastr.error(error.error.detail, 'Error');
        }
      );
  }

  // Método para obtener las entradas del logbook
  getLogbookEntries(): void {
    this.historyLogService.getLogbook(this.startDate, this.endDate).subscribe(
      (response: any) => {
        this.logbookEntries = response;
        console.log('Entradas del logbook:', this.logbookEntries);
        this.filteredLogbookEntries = [...this.logbookEntries];
        this.availableNames = [
          ...new Set(this.logbookEntries.map((entry: any) => entry.name || entry.entity_id)),
        ];

        // Crear gráfico
        this.createGraficEntries();
      },
      (error: any) => {
        this.toastr.error(error.error.detail, 'Error');
      }
    );
  }

  // Método para crear un gráfico de barras basado en logbookEntries
  createGraficEntries(): void {
    const threshold = 50; // Umbral de entradas para aislar dispositivos con demasiadas entradas
  
    // Agrupar las entradas por nombre o ID
    const groupedData = this.logbookEntries.reduce(
      (acc: Record<string, number>, entry: any) => {
        const name = entry.name || entry.entity_id;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      },
      {}
    );
  
    const overThreshold: Record<string, number> = {};
    const underThreshold: Record<string, number> = {};
  
    // Separar los dispositivos en dos categorías
    Object.entries(groupedData).forEach(([key, value]) => {
      if (value > threshold) {
        overThreshold[key] = value;
      } else {
        underThreshold[key] = value;
      }
    });
  
    // Datos para el gráfico principal (dispositivos con pocas entradas)
    const labelsUnder = Object.keys(underThreshold);
    const dataUnder = Object.values(underThreshold);
  
    const chartDataUnder : any = {
      type: 'bar',
      data: {
        labels: labelsUnder,
        datasets: [
          {
            label: 'Entradas por entidad (menos de 50 entradas)',
            data: dataUnder,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
          },
        ],
      },
    };
  
    // Datos para el gráfico separado (dispositivos con muchas entradas)
    const labelsOver = Object.keys(overThreshold);
    const dataOver = Object.values(overThreshold);
  
    const chartDataOver : any = {
      type: 'bar',
      data: {
        labels: labelsOver,
        datasets: [
          {
            label: 'Entradas por entidad (más de 50 entradas)',
            data: dataOver,
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
          },
        ],
      },
    };
  
    // Contenedor para el gráfico principal
    const canvasContainerUnder = document.getElementById('canvas-container-entries-under');
    if (canvasContainerUnder) {
      canvasContainerUnder.innerHTML =
        '<h2 class="text-center mb-4 text-xl">Dispositivos con pocas entradas</h2><section class="w-full"><canvas id="bar-chart-entries-under"></canvas></section>';
    }
  
    if (this.graficoEntries) {
      this.graficoEntries.destroy(); // Elimina el gráfico existente si ya fue creado
    }
  
    this.graficoEntries = new Chart(
      document.getElementById('bar-chart-entries-under') as HTMLCanvasElement,
      chartDataUnder
    );
  
    // Contenedor para el gráfico de dispositivos con muchas entradas
    const canvasContainerOver = document.getElementById('canvas-container-entries-over');
    if (canvasContainerOver) {
      canvasContainerOver.innerHTML =
        '<h2 class="text-center mb-4 text-xl">Dispositivos con muchas entradas</h2><section class="w-full"><canvas id="bar-chart-entries-over"></canvas></section>';
    }
  
    const graficoEntriesOver = new Chart(
      document.getElementById('bar-chart-entries-over') as HTMLCanvasElement,
      chartDataOver
    );
  }

  // Método para filtrar entradas del logbook
  filterLogbookEntries(): void {
    if (this.selectedNameFilter) {
      this.filteredLogbookEntries = this.logbookEntries.filter(
        (entry) => (entry.name || entry.entity_id) === this.selectedNameFilter
      );
    } else {
      this.filteredLogbookEntries = [...this.logbookEntries];
    }
  }


}
