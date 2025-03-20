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

  constructor(private router:Router, private accountService : AccountService) {
    this.formulario = new FormGroup({
      username: new FormControl('', [Validators.required]),
      pwd: new FormControl('', [Validators.required]),
    });
   }

  ngOnInit(): void {
  }


  login(){

    if(this.formulario.valid){

      let info={
        username: this.formulario.get('username')!.value,
        password: this.formulario.get('pwd')!.value
      }
  
      this.accountService.login(info).subscribe(
        (respuesta: any) => {
          console.log(respuesta.access_token)
          sessionStorage.setItem('token', respuesta.access_token)
          sessionStorage.setItem('username', info.username)
          this.router.navigate(['/intro'])
        },
        (error: any)=>{
            console.log(error)
            alert("Error " + error.error.detail)
        }
      )
      
    }

  }
  
}
