import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formulario: FormGroup
  name?: string
  pwd?: string
  message?: string

  constructor(private router:Router, private accountService : AccountService) {
    this.formulario = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]),
      pwd: new FormControl('', [Validators.required]),
    });
   }

  ngOnInit(): void {
  }


  login(){
    let info={
      name: this.formulario.get('email')!.value,
      pwd: this.formulario.get('pwd')!.value
    }

    console.log(info)

    /*this.accountService.login(info).subscribe(
      respuesta => {
        console.log(respuesta)
      },
      (error: any)=>{
        this.message="Ha habido un error"
      }
    )
    */
  }
  
}
