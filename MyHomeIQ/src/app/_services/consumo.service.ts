import { Injectable } from '@angular/core';
import { PruebaConsumo, TipoPrueba } from '../_models/prueba-consumo';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ConsumoService {

  constructor(private httpClient: HttpClient, private config: AppConfig) { }

  getPruebasConsumo(){
    const url = `${this.config.apiUrl}/consumo/`;

    return this.httpClient.get<PruebaConsumo[]>(url)
  }

  getTipoPruebas(){
    const url = `${this.config.apiUrl}/consumo/getPruebas`;

    return this.httpClient.get<TipoPrueba[]>(url)
  }

  createPConsumo(pruebaC:PruebaConsumo):any {
    const url = `${this.config.apiUrl}/consumo/create`;

    return this.httpClient.post(url, pruebaC);
  }

  createTipoPrueba(tipoPrueba:TipoPrueba):any {
    const url = `${this.config.apiUrl}/consumo/createTipoPrueba`;

    return this.httpClient.post(url, tipoPrueba);
  }

}
