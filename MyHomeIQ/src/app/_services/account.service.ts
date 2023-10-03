import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient:HttpClient, private config: AppConfig) { }

  login(info:any):Observable<any>{
    const url = `${this.config.apiUrl}/auth/login`;

    const formData = new FormData();
    formData.append('username', info.username)
    formData.append('password', info.password)

    return this.httpClient.post<any>(url,formData)
  }

  listarUsuarios():any {
    const url = `${this.config.apiUrl}/users/`;

    return this.httpClient.get(url);
  }

  updateUser(user:User):any {
    const url = `${this.config.apiUrl}/users/update`;

    return this.httpClient.put(url, user);
  }

  createUser(user:User):any {
    const url = `${this.config.apiUrl}/users/register`;

    return this.httpClient.post(url, user);
  }

  delete(id:string):any {
    const url = `${this.config.apiUrl}/users/delete/${id}`;

    return this.httpClient.delete(url);
  }
  
}
