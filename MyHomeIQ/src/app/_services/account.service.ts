import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { User } from '../_models/user';
import { ControlService } from './control.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient:HttpClient, private config: AppConfig, private header: ControlService) { }

  login(info:any):Observable<any>{
    const url = `${this.config.apiUrl}/auth/login`;

    const formData = new FormData();
    formData.append('username', info.username)
    formData.append('password', info.password)

    return this.httpClient.post<any>(url,formData)
  }

  me(): any{
    const url = `${this.config.apiUrl}/auth/me`;
    
    return this.httpClient.get<any>(url, {headers: this.header.getHeaders()})
  }

  listarUsuarios():any {
    const url = `${this.config.apiUrl}/users/`;

    return this.httpClient.get(url, {headers: this.header.getHeaders()});
  }

  updateUser(user:User):any {
    const url = `${this.config.apiUrl}/users/update`;

    return this.httpClient.put(url, user, {headers: this.header.getHeaders()});
  }

  createUser(user:User):any {
    const url = `${this.config.apiUrl}/users/register`;

    user.id = '0';
    user.homeAssistant = null;

    console.log(user);

    return this.httpClient.post(url, user);
  }

  delete(id:string):any {
    const url = `${this.config.apiUrl}/users/delete/${id}`;

    return this.httpClient.delete(url, {headers: this.header.getHeaders()});
  }
  
}
