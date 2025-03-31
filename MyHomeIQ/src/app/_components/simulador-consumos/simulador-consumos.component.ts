import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, retry, forkJoin, of } from 'rxjs';
import { SimuladorDispositivo } from 'src/app/_models/prueba-consumo';
import { SimuladorPersonalizado } from 'src/app/_models/simulador-consumo';
import { ConsumoService } from 'src/app/_services/consumo.service';
import { ControlLocalService } from 'src/app/_services/control-local.service';
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
    dispositivosSeleccionados: SimuladorPersonalizado[] = [];
    simuladorConsumoDiario!: number;
    simuladorConsumoMensual!: number;
    simuladorConsumoAnual!: number;
    simuladorIntensidadDiaria!: number;
    simuladorIntensidadMensual!: number;
    simuladorIntensidadAnual!: number;
    simuladorPotenciaDiaria!: number;
    simuladorPotenciaMensual!: number;
    simuladorPotenciaAnual!: number;

    responseNVD: any = null;
    vulnerabilities: any[] = [];
    resumenSeguridad: { categoria: string; totalVulnerabilidades: number; criticidadAlta: number; criticidadMedia: number; criticidadBaja: number }[] = [];
    
    // Propiedades de paginación
    Math = Math;
    currentPage: number = 0;
    itemsPerPage: number = 5;
    paginatedVulnerabilities: any[] = [];

    // Propiedades de paginación dispositivos
    currentPageDisp: number = 0;
    itemsPerPageDisp: number = 10;
    paginatedDispositivos: { device: string; estados: string; estado: string; duracion: number }[] = [];

    // Filtros de búsqueda
    filtroDispositivo: string = "";

    // Scritps
    allStatus!: any[];
    categories: string[] = ["light", "switch"];
    scripts!: any[];
    sockets!: any[];

    // Información de los dispositivos y su estado
    dispositivos: { dispositivo: string; script: string; estado: string; nombreDispositivo: string }[] = [
        { dispositivo: "Bombilla", script: "EB1", estado: "Temperatura mínimo - Brillo máximo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB2", estado: "Temperatura mínimo - Brillo medio", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB3", estado: "Temperatura mínimo - Brillo mínimo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB4", estado: "Temperatura media - Brillo máximo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB5", estado: "Temperatura media - Brillo medio", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB6", estado: "Temperatura media - Brillo mínimo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB7", estado: "Temperatura máximo - Brillo máximo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB8", estado: "Temperatura máximo - Brillo medio", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB9", estado: "Temperatura máximo - Brillo mínimo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB10", estado: "Rojo(255,0,0) - Brillo máximo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB11", estado: "Rojo(255,0,0) - Brillo medio", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB12", estado: "Rojo(255,0,0) - Brillo mínimo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB13", estado: "Amarillo(255,255,0) - Brillo máximo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB14", estado: "Amarillo(255,255,0) - Brillo medio", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB15", estado: "Amarillo(255,255,0) - Brillo mínimo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB16", estado: "Azul(0,0,255) - Brillo máximo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB17", estado: "Azul(0,0,255) - Brillo medio", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB18", estado: "Azul(0,0,255) - Brillo mínimo", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB19", estado: "Apagado", nombreDispositivo: "-" },
        { dispositivo: "Bombilla", script: "EB20", estado: "Temperatura mínimo - Brillo máximo", nombreDispositivo: "Bulb2" },
        
        { dispositivo: "Termostato", script: "TS1", estado: "Encender -> Temperatura por debajo", nombreDispositivo: "Termostato Wifi" },
        { dispositivo: "Termostato", script: "TS2", estado: "Temperatura por encima", nombreDispositivo: "Termostato Wifi" },
        { dispositivo: "Termostato", script: "TS3", estado: "Apagar", nombreDispositivo: "Termostato Wifi" },
        { dispositivo: "Termostato", script: "TS4", estado: "Encender -> Temperatura por debajo", nombreDispositivo: "Termostato Zigbee" },
        { dispositivo: "Termostato", script: "TS5", estado: "Temperatura por encima", nombreDispositivo: "Termostato Zigbee" },
        { dispositivo: "Termostato", script: "TS6", estado: "Apagar", nombreDispositivo: "Termostato Zigbee" },
        { dispositivo: "Termostato", script: "TS7", estado: "Apagar", nombreDispositivo: "Ambos" },
    
        { dispositivo: "AlexaEchoDot", script: "EAD1", estado: "Encender dispositivos", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoDot", script: "EAD2", estado: "Apagar dispositivos", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoDot", script: "EAD3", estado: "Iniciar música", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoDot", script: "EAD4", estado: "Encender dispositivos - VOZ", nombreDispositivo: "-" },
    
        { dispositivo: "AlexaEchoShow", script: "EAS1", estado: "Panel home", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS2", estado: "Panel scripts", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS3", estado: "Encender dispositivos", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS4", estado: "Apagar dispositivos", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS5", estado: "Iniciar música", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS6", estado: "Iniciar multimedia (video)", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS7", estado: "Ver cámara", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS8", estado: "Panel home - VOZ", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS9", estado: "Panel sensores - VOZ", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS10", estado: "Encender dispositivos - VOZ", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS11", estado: "Apagar dispositivos - VOZ", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS12", estado: "Iniciar música - VOZ", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS13", estado: "Iniciar multimedia (video) - VOZ", nombreDispositivo: "-" },
        { dispositivo: "AlexaEchoShow", script: "EAS14", estado: "Ver cámara - VOZ", nombreDispositivo: "-" },
    
        { dispositivo: "Cámara", script: "SC1", estado: "Encender cámaras", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC2", estado: "Habilitar alarma de seguimiento", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC3", estado: "Tomar varias instantáneas", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC4", estado: "Transmitir video cámara 1", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC5", estado: "Transmitir video cámara 2", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC6", estado: "Habilitar grabación de video", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC7", estado: "Habilitar indicador led", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC8", estado: "Habilitar marca de agua de tiempo", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC9", estado: "Habilitar modo privado", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC10", estado: "Habilitar sensibilidad de movimiento baja", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC11", estado: "Habilitar sensibilidad de movimiento media", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC12", estado: "Habilitar sensibilidad de movimiento alta", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC13", estado: "Habilitar visión nocturna automática", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC14", estado: "Habilitar visión nocturna activada", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC15", estado: "Habilitar seguimiento de movimiento", nombreDispositivo: "-" },
        { dispositivo: "Cámara", script: "SC16", estado: "Apagar cámaras", nombreDispositivo: "-" },
        
        { dispositivo: "GoogleHub", script: "EGH1", estado: "Panel home", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH2", estado: "Panel sensores", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH3", estado: "Encender dispositivos", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH4", estado: "Apagar dispositivos", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH5", estado: "Iniciar música", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH6", estado: "Iniciar multimedia (video)", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH7", estado: "Ver cámara", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH8", estado: "Panel home - VOZ", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH9", estado: "Panel sensores - VOZ", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH10", estado: "Encender dispositivos - VOZ", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH11", estado: "Apagar dispositivos - VOZ", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH12", estado: "Iniciar música - VOZ", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH13", estado: "Iniciar multimedia (video) - VOZ", nombreDispositivo: "-" },
        { dispositivo: "GoogleHub", script: "EGH14", estado: "Ver cámara - VOZ", nombreDispositivo: "-" },
    
        { dispositivo: "GoogleNest", script: "EGN1", estado: "Encender dispositivos", nombreDispositivo: "-" },
        { dispositivo: "GoogleNest", script: "EGN2", estado: "Apagar dispositivos", nombreDispositivo: "-" },
        { dispositivo: "GoogleNest", script: "EGN3", estado: "Iniciar música", nombreDispositivo: "-" },
        { dispositivo: "GoogleNest", script: "EGN4", estado: "Iniciar multimedia (video)", nombreDispositivo: "-" },
        { dispositivo: "GoogleNest", script: "EGN5", estado: "Encender dispositivos - VOZ", nombreDispositivo: "-" },
        { dispositivo: "GoogleNest", script: "EGN6", estado: "Apagar dispositivos - VOZ", nombreDispositivo: "-" },
        { dispositivo: "GoogleNest", script: "EGN7", estado: "Iniciar música - VOZ", nombreDispositivo: "-" },
        { dispositivo: "GoogleNest", script: "EGN8", estado: "Iniciar multimedia (video) - VOZ", nombreDispositivo: "-" }
    ];
      
    // Extrae los dispositivos únicos para el filtro
    dispositivosUnicos = [...new Set(this.dispositivos.map(d => d.dispositivo))];

    constructor(private consumoService: ConsumoService, private toastr: ToastrService, private nvdapiService: NvdapiService, private controlLocalService: ControlLocalService) {

    }
    ngOnInit() {
        this.getScripts();
        this.get_dispositivosSimulador();
        const storedResumenSeguridad = localStorage.getItem('resumenSeguridad');
        const storedEtiquetaSeguridad = localStorage.getItem('etiquetaSeguridad');
        const storedVulnerabilities = localStorage.getItem('vulnerabilities');

        if (storedResumenSeguridad) {
            const parsed = JSON.parse(storedResumenSeguridad);
            // Asegurar que sea un array
            this.resumenSeguridad = Array.isArray(parsed) ? parsed : [];
        }

        if (storedEtiquetaSeguridad) {
            this.etiquetaSeguridad = storedEtiquetaSeguridad;
        }

        if (storedVulnerabilities) {
            const parse = JSON.parse(storedVulnerabilities);
            this.vulnerabilities = parse.vulnerabilities;
        } else {
            this.vulnerabilities = [];
        }
        this.updatePaginatedVulnerabilities();
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

    async getScripts() {
        // Obtenemos los scripts del backend
        this.controlLocalService.getAll().subscribe(
          (response: any) => {
            this.initialArrays(response);
    
          },
          (error: any) => {
            this.toastr.error(error.error.detail, 'Error');
          }
        );
    }

    private initialArrays(response: any) {
    this.allStatus = response;
    this.categories = response.map((item: any) => item.entity_id.split('.')[0]);
    // Eliminamos las categorías duplicadas
    this.categories = this.categories.filter((item, index) => this.categories.indexOf(item) === index);
    this.scripts = response.map((item: any) => {
        if (item.entity_id.split('.')[0] === 'script') {
        return item;
        }
    });
    // Eliminamos los scripts undefined
    this.scripts = this.scripts.filter((item) => item !== undefined);
    this.sockets = response.map((item: any) => {
        if (item.entity_id.split('.')[0] === 'switch') {
        return item;
        }
    });
    // Eliminamos los sockets undefined
    this.sockets = this.sockets.filter((item) => item !== undefined);
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
    
            this.dispositivosSeleccionados.push({
                device: this.dispositivoSeleccionado.devices[0],
                estado: this.dispositivoSeleccionado.estado, // Aseguramos que siempre sea un array
                tipoSimulacion: this.dispositivoSeleccionado.estado, // Estado inicial seleccionado
                duracion: 0, // El usuario lo llenará manualmente
            });
    
            this.dispositivoSeleccionado = undefined!; // Limpiamos la selección actual
        } else {
            this.toastr.warning('Por favor, selecciona un dispositivo antes de añadirlo.');
        }
    }    

    limpiarDispositivos() {
        this.dispositivosSeleccionados = [];
    }

    calcular_consumos_personalizado(){
        console.log("Calculando consumos personalizados...")

        this.dispositivosSeleccionados.forEach((dispositivo) => {
            dispositivo.tipoSimulacion = "Personalizado";
        })

        console.log("Dispositivos personalizados: ", this.dispositivosSeleccionados)

        // Envio los dispositivos al backend
        this.consumoService.updateSimuladorDispositivo(this.dispositivosSeleccionados).subscribe(
            (response: any) => {
                console.log("Consumos personalizados: ", response)
                this.simuladorConsumoDiario = response.consumoDiario
                this.simuladorIntensidadDiaria = response.intensidadDiaria
                this.simuladorPotenciaDiaria = response.potenciaDiaria
                this.cip_mensual()
                this.cip_anual()
                this.toastr.success('Consumos personalizados calculados con éxito.');
            }, (error: any) => {
                this.toastr.error(error.error.detail, 'Error');
                console.log(error);
            })
    }

    cip_mensual(){
        this.simuladorConsumoMensual = this.simuladorConsumoDiario * 31
        this.simuladorIntensidadMensual = this.simuladorIntensidadDiaria * 31
        this.simuladorPotenciaMensual = this.simuladorPotenciaDiaria * 31
    }

    cip_anual(){
        this.simuladorConsumoAnual = this.simuladorConsumoMensual * 12
        this.simuladorIntensidadAnual = this.simuladorIntensidadMensual * 12
        this.simuladorPotenciaAnual = this.simuladorPotenciaMensual * 12
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
            const dispositivoData = this.consumoDispositivos.find(d => d.devices[0] === dispositivo.device);

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
        this.simuladorIntensidadDiaria = intensidadTotal;
        this.simuladorPotenciaDiaria = potenciaTotal;

        this.cip_mensual()
        this.cip_anual()
        
        this.toastr.success('Cálculo basado en simulador realizado con éxito.');
    }

    verificarTipoConsumo() {
        if (this.dispositivosSeleccionados.length === 0) {
            this.toastr.warning('No hay dispositivos añadidos para calcular.');
            return;
        }
        let simulacion_personalizada : boolean = false
        this.dispositivosSeleccionados.forEach((dispositivo) => {
            if (dispositivo.estado !== 'Global') {
                simulacion_personalizada = true
            }
        })
        if (simulacion_personalizada) {
            this.calcular_consumos_personalizado()
        } else {
            this.calcularConsumosSimulador()
        }
    }

    getSecurity() {
        if (!this.consumoDispositivos || this.consumoDispositivos.length === 0) {
            this.toastr.warning('No hay dispositivos disponibles para analizar');
            return;
        }

        console.log("Buscando vulnerabilidades de dispositivos...");

        const criticidadValores: { [key: string]: number } = { Critical: 5, High: 4, Medium: 3, Low: 2, None: 1 };
        let criticidadTotal = 0;

        const solicitudes = this.consumoDispositivos.map((dispositivo) => {
            if (!dispositivo?.devices[0]) {
                console.warn('Dispositivo sin información válida:', dispositivo);
                return of(null);
            }

            const categoriaDispositivo = dispositivo.devices[0].split('.')[0];
            if (!categoriaDispositivo) {
                console.warn('No se pudo obtener categoría del dispositivo:', dispositivo);
                return of(null);
            }

            console.log(`Buscando vulnerabilidades para ${categoriaDispositivo}...`);
            return this.nvdapiService.searchVulnerabilities(categoriaDispositivo).pipe(
                retry(3),
                catchError((error: any) => {
                    console.error(`Error al buscar vulnerabilidades para ${categoriaDispositivo}`, error);
                    this.toastr.error(`Error al buscar vulnerabilidades para ${categoriaDispositivo}`, "Error");
                    return of({ vulnerabilities: [], totalResults: 0 }); // Retornar objeto vacío en caso de error
                })
            );
        });

                forkJoin(solicitudes).subscribe(
                    (respuestas: any[]) => {
                        this.vulnerabilities = []; // Limpiar vulnerabilidades anteriores
                        const resumenVulnerabilidades: { categoria: string; totalVulnerabilidades: number; criticidadAlta: number; criticidadMedia: number; criticidadBaja: number }[] = [];

                        respuestas.forEach((respuesta, index) => {
                            const categoriaDispositivo = this.consumoDispositivos[index].devices[0].split('.')[0];
                            this.vulnerabilities = Array.isArray(respuesta.vulnerabilities) ? respuesta.vulnerabilities : [];
                            
                            // Agregar vulnerabilidades a la lista global
                            this.vulnerabilities = this.vulnerabilities.concat(this.vulnerabilities);

                            console.log(`Vulnerabilidades encontradas para ${categoriaDispositivo}:`, this.vulnerabilities);

                        let criticidadAlta = 0;
                        let criticidadMedia = 0;
                        let criticidadBaja = 0;

                    if (respuesta.totalResults > 0) {
                        this.vulnerabilities.forEach((vuln: any) => {
                            const criticidad = vuln.cve.metrics?.cvssMetricV2?.[0]?.baseSeverity?.toUpperCase() ||
                                vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity?.toUpperCase() ||
                                'None';

                            console.log("Vulnerabilidad: ", vuln);
                            console.log("Criticidad: ", vuln.cve.metrics?.cvssMetricV2?.[0]?.baseSeverity || vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity);

                        switch(criticidad) {
                            case 'CRITICAL':
                                criticidadAlta++;
                                break;
                            case 'HIGH':
                                criticidadAlta++;
                                break;
                            case 'MEDIUM':
                                criticidadMedia++;
                                break;
                            case 'LOW':
                                criticidadBaja++;
                                break;
                        }

                            // Sumar la criticidad según el nivel
                            criticidadTotal += criticidadValores[criticidad] || 1;
                        });
                    }

                    // Añadir al resumen
                        resumenVulnerabilidades.push({
                            categoria: categoriaDispositivo,
                            totalVulnerabilidades: this.vulnerabilities.length,
                            criticidadAlta: criticidadAlta || 0,
                            criticidadMedia: criticidadMedia || 0,
                            criticidadBaja: criticidadBaja || 0
                        });
                });

                // Calcular la etiqueta global
                const media = criticidadTotal / this.consumoDispositivos.length;
                this.etiquetaSeguridad = this.obtenerEtiquetaSeguridad(media);
                // Filtrar y ordenar categorías
                this.resumenSeguridad = resumenVulnerabilidades
                    .filter((v, index, self) =>
                        index === self.findIndex((t) => t.categoria === v.categoria)
                    )
                    .sort((a, b) => a.categoria.localeCompare(b.categoria));

                // Guardar los datos en localStorage
                localStorage.setItem('resumenSeguridad', JSON.stringify(this.resumenSeguridad));
                localStorage.setItem('etiquetaSeguridad', this.etiquetaSeguridad);
                localStorage.setItem('vulnerabilities', JSON.stringify(this.vulnerabilities));
                console.log("Vulnerabilidades:", this.vulnerabilities);

                console.log("Etiqueta de seguridad global:", this.etiquetaSeguridad);
                this.toastr.success('Vulnerabilidades actualizadas correctamente');
            },
            (error) => {
                console.error("Error al procesar las solicitudes de vulnerabilidades", error);
                this.toastr.error("Error al procesar las vulnerabilidades", "Error");
            }
        );
    }
    
    // Almacenar el resumen de seguridad
    filtroCriticidad: string = '';
    
    // Métodos de paginación
    nextPage() {
        if ((this.currentPage + 1) * this.itemsPerPage < this.vulnerabilitiesFiltered.length) {
            this.currentPage++;
            this.updatePaginatedVulnerabilities();
        }
    }

    // Método para obtener los dispositivos filtrados
    get dispositivosFiltrados() {
        return this.filtroDispositivo
        ? this.dispositivos.filter(d => d.dispositivo === this.filtroDispositivo)
        : this.dispositivos;
    }

    // Método para filtrar dispositivos y resetear la paginación
    filtrarDispositivos() {
        this.currentPageDisp = 0; // Reinicia la paginación cuando se cambia el filtro
    }

    previousPageDisp() {
        if (this.currentPageDisp > 0) {
          this.currentPageDisp--;
        }
      }
      
    nextPageDisp() {
    if ((this.currentPageDisp + 1) * this.itemsPerPageDisp < this.dispositivosFiltrados.length) {
        this.currentPageDisp++;
    }
    }
      

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updatePaginatedVulnerabilities();
        }
    }

    updatePaginatedVulnerabilities() {
        const startIndex = this.currentPage * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedVulnerabilities = this.vulnerabilitiesFiltered.slice(startIndex, endIndex);
    }

    get vulnerabilitiesFiltered() {
        if (!this.vulnerabilities || this.vulnerabilities.length === 0) {
            return [];
        }

        return this.vulnerabilities.filter(v => {
            if (!v) return false;
            
            const coincideCriticidad = !this.filtroCriticidad || 
                (v.severity?.toLowerCase() === this.filtroCriticidad.toLowerCase() ||
                 v.severity?.toLowerCase() === this.filtroCriticidad.toLowerCase());

            return coincideCriticidad;
        });
    }

    verDetalleCVE(cveId: string) {
        const url = `https://nvd.nist.gov/vuln/detail/${cveId}`;
        window.open(url, '_blank');
    }
    
    
    // Método para calcular la etiqueta de seguridad
    obtenerEtiquetaSeguridad(criticidadMedia: number): string {
        if (criticidadMedia >= 4.5) return "Critical";
        if (criticidadMedia >= 3.5) return "High";
        if (criticidadMedia >= 2.5) return "Medium";
        if (criticidadMedia >= 1.5) return "Low";
        return "None";
    }    
    
}
