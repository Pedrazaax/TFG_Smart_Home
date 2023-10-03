import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formulario: FormGroup
  name?: string
  email?: string
  pwd1?: string
  pwd2?: string

  constructor(private router: Router, private accountService: AccountService) {
    this.formulario = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]),
      password1: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  register() {
    let info = {
      username: this.formulario.get('name')!.value,
      email: this.formulario.get('email')!.value,
      pwd: this.formulario.get('password1')!.value,
      pwd2: this.formulario.get('password2')!.value,
    }

    console.log(info)

    this.accountService.createUser(info).subscribe((respuesta: any) => {
      console.log(respuesta)
    },
      (error: any) => {
        console.log(error)
        alert("Error" + error.error.message)
      }
    )

    this.router.navigate(['/login'])
  }

}
