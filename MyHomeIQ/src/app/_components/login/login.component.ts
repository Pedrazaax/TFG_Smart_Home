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
  username?: string
  pwd?: string
  message?: string

  constructor(private router:Router, private accountService : AccountService) {
    this.formulario = new FormGroup({
      username: new FormControl('', [Validators.required]),
      pwd: new FormControl('', [Validators.required]),
    });
   }

  ngOnInit(): void {
  }


  login(){
    let info={
      username: this.formulario.get('username')!.value,
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
