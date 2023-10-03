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
      password1: new FormControl('', [Validators.required, this.passwordValidator()]),
      password2: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    
  }

  passwordValidator(){
    return (control: FormControl) => {
      const pwd = control.value;
      const hasUppercase = /[A-Z]/.test(pwd);
      const hasLowercase = /[a-z]/.test(pwd);
      const hasMinLength = pwd.length >=8;

      const errors : { [key: string]: boolean } = {};

      if (!hasUppercase) {
        errors['noUppercase'] = true;
      }

      if (!hasLowercase) {
        errors['noUppercase'] = true;
      }

      if (!hasMinLength) {
        errors['noMinLength'] = true;
      }

      return Object.keys(errors).length === 0 ? null : errors;
    };
  }

  register() {

    if(this.formulario.valid){

      const pwd = this.formulario.get('password1')!.value;
      const pwd2 = this.formulario.get('password2')!.value;

      // Comprobar que las contraseñas coincidan
      if (pwd != pwd2){
        alert("Error, las contraseñas no coinciden")
        return;
      }
        
      let info = {
        username: this.formulario.get('name')!.value,
        disabled: true,
        email: this.formulario.get('email')!.value,
        pwd: this.formulario.get('password1')!.value,
        pwd2: this.formulario.get('password2')!.value,
      }
  
      this.accountService.createUser(info).subscribe((respuesta: any) => {
        this.router.navigate(['/login'])
      },
        (error: any) => {
          alert("Error" + error.detail)
        }
      )
    }

  }

}
