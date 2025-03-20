import { Injectable } from '@angular/core';
import { PruebaConsumo, TipoPrueba, SimuladorDispositivo } from '../_models/prueba-consumo';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { ControlService } from './control.service';
import { SimuladorPersonalizado } from '../_models/simulador-consumo';

@Injectable({
  providedIn: 'root'
})
export class ConsumoService {

  constructor(private httpClient: HttpClient, private config: AppConfig, private header: ControlService) { }

  getPruebasConsumo(){
    const url = `${this.config.apiUrl}/consumo/`;

    return this.httpClient.get<PruebaConsumo[]>(url, {headers: this.header.getHeaders()})
  }

  getTipoPruebas(){
    const url = `${this.config.apiUrl}/consumo/getPruebas`;

    return this.httpClient.get<TipoPrueba[]>(url, {headers: this.header.getHeaders()})
  }

  createPConsumo(pruebaC:PruebaConsumo):any {
    const url = `${this.config.apiUrl}/consumo/create`;

    return this.httpClient.post(url, pruebaC, {headers: this.header.getHeaders()});
  }

  createTipoPrueba(tipoPrueba:TipoPrueba):any {
    const url = `${this.config.apiUrl}/consumo/createTipoPrueba`;

    return this.httpClient.post(url, tipoPrueba, {headers: this.header.getHeaders()});
  }

  deleteTipoPrueba(id:string):any {
    const url = `${this.config.apiUrl}/consumo/deleteTipoPrueba/${id}`;

    return this.httpClient.delete(url, {headers: this.header.getHeaders()});
  }

  getSimuladorDispositivos() {
    const url = `${this.config.apiUrl}/consumo/getDispositivosSimulador`;

    return this.httpClient.get<SimuladorDispositivo[]>(url, {headers: this.header.getHeaders()})
  }

  updateSimuladorDispositivos() {
    const url = `${this.config.apiUrl}/localMeasures/updateMeasurementsConsumption`;

    return this.httpClient.get<SimuladorDispositivo[]>(url, {headers: this.header.getHeaders()})
  }

  updateSimuladorDispositivo(simulador: SimuladorPersonalizado[]):any {
    const url = `${this.config.apiUrl}/localMeasures/updateConsumptionCustom`;

    return this.httpClient.post(url, simulador, {headers: this.header.getHeaders()});
  }

}
