import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorylogService {

  constructor(private httpClient: HttpClient, private config: AppConfig) { }

  getHeaders() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agregar el token JWT en el encabezado
    });

    return headers;
  } 

  getPeriod(startTime: string, endTime: string): Observable<any> {

    const url = `${this.config.apiUrl}/historylogs/getPeriod/${startTime}&${endTime}`;

    return this.httpClient.get(url, { headers: this.getHeaders() });

  }

  // Método para obtener las entradas del logbook
  getLogbook(startTime: string, endTime?: string): Observable<any> {
    const url = `${this.config.apiUrl}/historylogs/getLogbook/${startTime}&${endTime}`;

    return this.httpClient.get(url, { headers: this.getHeaders() });
  }

}
