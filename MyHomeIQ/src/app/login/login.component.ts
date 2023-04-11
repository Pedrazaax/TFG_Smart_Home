import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  name?: string
  pwd?: string
  message?: string

  constructor(private router:Router, private accountService : AccountService) { }

  ngOnInit(): void {
  }
  login(){
    let info={
      name:this.name,
      pwd1:this.pwd
    }
    this.accountService.login(info).subscribe(
      (respuesta: { httpSessionId: string; }) => {
        this.message="Hola, "+ this.name
        console.log((respuesta.httpSessionId))
        sessionStorage.setItem("httpSessionId", respuesta.httpSessionId!)
        sessionStorage.setItem("player", this.name!)
        this.router.navigate(['/match'])
      },
      (error: any)=>{
        this.message="Ha habido un error"
      }
    )
  }

  register(){
    this.router.navigate(['/register'])
  }
  
}
