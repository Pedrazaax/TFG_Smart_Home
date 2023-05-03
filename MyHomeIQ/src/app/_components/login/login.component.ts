import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';


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
      respuesta => {
        console.log(respuesta)
      },
      (error: any)=>{
        this.message="Ha habido un error"
      }
    )
  }
  
}
