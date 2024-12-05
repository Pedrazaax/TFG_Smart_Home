import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, retry, throwError, forkJoin } from 'rxjs';
import { SimuladorDispositivo } from 'src/app/_models/prueba-consumo';
import { ConsumoService } from 'src/app/_services/consumo.service';
import { NvdapiService } from 'src/app/_services/nvdapi.service';

@Component({
    selector: 'app-simulador-consumos',
    templateUrl: './simulador-consumos.component.html',
    styleUrls: ['./simulador-consumos.component.css']
})
export class SimuladorConsumosComponent {

    consumoDispositivos!: SimuladorDispositivo[]
    consumoDiario!: number
    consumoMensual!: number
    consumoAnual!: number
    intensidadDiaria!: number
    intensidadMensual!: number
    intensidadAnual!: number
    potenciaDiaria!: number
    potenciaMensual!: number
    potenciaAnual!: number
    etiquetaGlobal!: string
    etiquetaSeguridad!: string;
    dispositivoSeleccionado!: SimuladorDispositivo;
    dispositivosSeleccionados: { device: string; estados: string[]; estado: string; duracion: number }[] = [];
    simuladorConsumoDiario!: number;
    simuladorConsumoMensual!: number;
    simuladorConsumoAnual!: number;
    simuladorIntensidadDiaria!: number;
    simuladorIntensidadMensual!: number;
    simuladorIntensidadAnual!: number;
    simuladorPotenciaDiaria!: number;
    simuladorPotenciaMensual!: number;
    simuladorPotenciaAnual!: number;

    responseNVD!: any;
    vulnerabilities!: any;

    constructor(private consumoService: ConsumoService, private toastr: ToastrService, private nvdapiService: NvdapiService) {

    }
    ngOnInit() {
        this.get_dispositivosSimulador();
        const storedResumenSeguridad = localStorage.getItem('resumenSeguridad');
        const storedEtiquetaSeguridad = localStorage.getItem('etiquetaSeguridad');

        if (storedResumenSeguridad) {
            this.resumenSeguridad = JSON.parse(storedResumenSeguridad);
        }

        if (storedEtiquetaSeguridad) {
            this.etiquetaSeguridad = storedEtiquetaSeguridad;
        }
    }

    get_dispositivosSimulador() {
        this.consumoService.getSimuladorDispositivos().subscribe(
            (response: any) => {
                this.consumoDispositivos = response
                this.get_consumosGlobales();
                this.get_etiquetaGlobal();
                console.log("Dispositivos: ", this.consumoDispositivos)
            },
            (error: any) => {
                this.toastr.error(error.error.detail, "Error")
            }
        );
    }

    get_consumosGlobales() {
        let consumoGlogal = 0;
        let intensidadGlobal = 0;
        let potenciaGlobal = 0;
        for (let dispositivo of this.consumoDispositivos) {
            consumoGlogal += parseFloat(dispositivo.consumoMedio)
            intensidadGlobal += parseFloat(dispositivo.intensidadMedia)
            potenciaGlobal += parseFloat(dispositivo.potenciaMedia)
        }
        this.consumoDiario = consumoGlogal * 24
        this.consumoMensual = this.consumoDiario * 31
        this.consumoAnual = this.consumoMensual * 12
        this.intensidadDiaria = intensidadGlobal * 24
        this.intensidadMensual = this.intensidadDiaria * 31
        this.intensidadAnual = this.intensidadMensual * 12
        this.potenciaDiaria = potenciaGlobal * 24
        this.potenciaMensual = this.potenciaDiaria * 31
        this.potenciaAnual = this.potenciaMensual * 12
        console.log("Consumo diario: " + this.consumoDiario + " // Consumo mensual: " + this.consumoMensual + " // Consumo anual. " + this.consumoAnual)
        console.log("Intensidad diaria: " + this.intensidadDiaria + " // Intensidad mensual: " + this.intensidadMensual + " // Intensidad anual. " + this.intensidadAnual)
        console.log("Potencia diaria: " + this.potenciaDiaria + " // Potencia mensual: " + this.potenciaMensual + " // Potencia anual. " + this.potenciaAnual)
    }

    get_etiquetaGlobal() {
        const etiquetaValores: { [key: string]: number } = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 };
        const etiquetas = this.consumoDispositivos.map(d => etiquetaValores[d.etiqueta]);
    
        const mediaNumerica = etiquetas.reduce((a, b) => a + b, 0) / etiquetas.length;
        const valorRedondeado = Math.round(mediaNumerica);
    
        // Invertimos el objeto para obtener la etiqueta correspondiente al valor redondeado
        const valorEtiquetas = Object.keys(etiquetaValores).find(key => etiquetaValores[key] === valorRedondeado);
        this.etiquetaGlobal = valorEtiquetas || 'Error'; // En caso de error, asignamos 'G' por defecto
      }

      getEtiquetaClase(etiqueta: string): string {
        return `etiqueta-${etiqueta}`;
      }

    update_consumos() {
        this.consumoService.updateSimuladorDispositivos().subscribe(
            (response) => {
                this.consumoDispositivos = response
                this.get_consumosGlobales()
                this.get_etiquetaGlobal()
            },
            (error: any) => {
                this.toastr.error(error.error.detail, 'Error');
                console.log(error);
              }
        )
    }

    addDispositivo() {
        if (this.dispositivoSeleccionado) {
            const estado = Array.isArray(this.dispositivoSeleccionado.estado)
                ? this.dispositivoSeleccionado.estado
                : [this.dispositivoSeleccionado.estado]; // Convertir a array si es string
    
            this.dispositivosSeleccionados.push({
                device: this.dispositivoSeleccionado.device,
                estados: estado, // Aseguramos que siempre sea un array
                estado: estado[0], // Estado inicial seleccionado
                duracion: 0 // El usuario lo llenará manualmente
            });
    
            this.dispositivoSeleccionado = undefined!; // Limpiamos la selección actual
        } else {
            this.toastr.warning('Por favor, selecciona un dispositivo antes de añadirlo.');
        }
    }    

    limpiarDispositivos() {
        this.dispositivosSeleccionados = [];
    }

    calcularConsumosSimulador() {
        if (this.dispositivosSeleccionados.length === 0) {
            this.toastr.warning('No hay dispositivos añadidos para calcular.');
            return;
        }
    
        // Variables para acumulación de consumos
        let consumoTotal = 0;
        let intensidadTotal = 0;
        let potenciaTotal = 0;
    
        // Iterar sobre los dispositivos seleccionados
        this.dispositivosSeleccionados.forEach((dispositivo) => {
            const duracion = dispositivo.duracion || 0; // Horas al día
            const dispositivoData = this.consumoDispositivos.find(d => d.device === dispositivo.device);
    
            if (dispositivoData) {
                const consumoMedio = parseFloat(dispositivoData.consumoMedio || '0'); // Consumo medio por hora
                const intensidadMedia = parseFloat(dispositivoData.intensidadMedia || '0'); // Intensidad media por hora
                const potenciaMedia = parseFloat(dispositivoData.potenciaMedia || '0'); // Potencia media por hora
    
                // Acumular los valores multiplicados por la duración (horas/día)
                consumoTotal += consumoMedio * duracion;
                intensidadTotal += intensidadMedia * duracion;
                potenciaTotal += potenciaMedia * duracion;
            }
        });
    
        // Calcular valores diarios, mensuales y anuales
        this.simuladorConsumoDiario = consumoTotal;
        this.simuladorConsumoMensual = consumoTotal * 31;
        this.simuladorConsumoAnual = this.simuladorConsumoMensual * 12;
    
        this.simuladorIntensidadDiaria = intensidadTotal;
        this.simuladorIntensidadMensual = intensidadTotal * 31;
        this.simuladorIntensidadAnual = this.simuladorIntensidadMensual * 12;
    
        this.simuladorPotenciaDiaria = potenciaTotal;
        this.simuladorPotenciaMensual = potenciaTotal * 31;
        this.simuladorPotenciaAnual = this.simuladorPotenciaMensual * 12;
    
        this.toastr.success('Cálculo basado en simulador realizado con éxito.');
    }

    getSecurity() {
        console.log("Buscando vulnerabilidades de dispositivos...");

        const criticidadValores: { [key: string]: number } = { Critical: 5, High: 4, Medium: 3, Low: 2, None: 1 };
        let criticidadTotal = 0;

        const solicitudes = this.consumoDispositivos.map((dispositivo) => {
            const categoriaDispositivo = dispositivo.device.split('.')[0];
            console.log(`Buscando vulnerabilidades para ${categoriaDispositivo}...`);
            return this.nvdapiService.searchVulnerabilities(categoriaDispositivo).pipe(
                retry(3), // Reintentar hasta 3 veces en caso de error
                catchError((error: any) => {
                    console.error(`Error al buscar vulnerabilidades para ${categoriaDispositivo}`, error);
                    this.toastr.error(`Error al buscar vulnerabilidades para ${categoriaDispositivo}`, "Error");
                    return throwError(() => error); // Propagar el error para que forkJoin lo maneje
                })
            );
        });

        forkJoin(solicitudes).subscribe(
            (respuestas: any[]) => {
                const resumenVulnerabilidades: { categoria: string; totalVulnerabilidades: number; criticidadAlta: number; criticidadMedia: number }[] = [];

                respuestas.forEach((respuesta, index) => {
                    const categoriaDispositivo = this.consumoDispositivos[index].device.split('.')[0];
                    const vulnerabilidades = Array.isArray(respuesta.vulnerabilities) ? respuesta.vulnerabilities : [];

                    let criticidadAlta = 0;
                    let criticidadMedia = 0;

                    if (respuesta.totalResults > 0) {
                        vulnerabilidades.forEach((vuln: any) => {
                            const criticidad = vuln.cve.metrics?.cvssMetricV2?.[0]?.baseSeverity?.toUpperCase() ||
                                vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity?.toUpperCase() ||
                                'None';

                            console.log("Vulnerabilidad: ", vuln);
                            console.log("Criticidad: ", vuln.cve.metrics?.cvssMetricV2?.[0]?.baseSeverity || vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity);

                            if (criticidad === 'HIGH') {
                                criticidadAlta++;
                            }

                            if (criticidad === 'MEDIUM' || criticidad === 'LOW') {
                                criticidadMedia++;
                            }

                            // Sumar la criticidad según el nivel
                            criticidadTotal += criticidadValores[criticidad] || 1;
                        });
                    }

                    // Añadir al resumen
                    resumenVulnerabilidades.push({
                        categoria: categoriaDispositivo,
                        totalVulnerabilidades: vulnerabilidades.length,
                        criticidadAlta,
                        criticidadMedia
                    });
                });

                // Calcular la etiqueta global
                const criticidadMedia = criticidadTotal / this.consumoDispositivos.length;
                this.etiquetaSeguridad = this.obtenerEtiquetaSeguridad(criticidadMedia);
                // Filtrar categorías duplicadas
                this.resumenSeguridad = resumenVulnerabilidades.filter((v, index, self) =>
                    index === self.findIndex((t) => t.categoria === v.categoria)
                );

                // Guardar los datos en localStorage
                localStorage.setItem('resumenSeguridad', JSON.stringify(this.resumenSeguridad));
                localStorage.setItem('etiquetaSeguridad', this.etiquetaSeguridad);

                console.log("Etiqueta de seguridad global:", this.etiquetaSeguridad);
            },
            (error) => {
                console.error("Error al procesar las solicitudes de vulnerabilidades", error);
                this.toastr.error("Error al procesar las vulnerabilidades", "Error");
            }
        );
    }
    
    // Nueva variable para almacenar el resumen de seguridad
    resumenSeguridad: { categoria: string; totalVulnerabilidades: number; criticidadAlta: number, criticidadMedia: number }[] = [];
    
    
    // Método para calcular la etiqueta de seguridad
    obtenerEtiquetaSeguridad(criticidadMedia: number): string {
        if (criticidadMedia >= 4.5) return "Critical";
        if (criticidadMedia >= 3.5) return "High";
        if (criticidadMedia >= 2.5) return "Medium";
        if (criticidadMedia >= 1.5) return "Low";
        return "None";
    }    
    
}