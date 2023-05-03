import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private httpClient: HttpClient) { }

  /*
  controlOnOff(): Observable<any> {
    return this.httpClient.get<any>("http://localhost/smartHome/" + sessionStorage.getItem("player"));
  }
  */
}
