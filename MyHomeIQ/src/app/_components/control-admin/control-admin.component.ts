import { Component } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-control-admin',
  templateUrl: './control-admin.component.html',
  styleUrls: ['./control-admin.component.css']
})
export class ControlAdminComponent {

  usernameCrear?:string;
  emailCrear?:string;

  formulario: FormGroup;
  formularioCrear: FormGroup;
  users!: User[];
  selectedRow!: number;
  stateUpdate: boolean = false;
  stateClear: boolean = false;
  stateCreate: boolean = false;
  stateDelete: boolean = false;

  ngOnInit(): void {
    this.ver()
  }

  constructor(private accountService: AccountService, private toastr: ToastrService) {

    this.formularioCrear = new FormGroup({
      usernameCrear: new FormControl('', [Validators.required]),
      emailCrear: new FormControl('', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)])
    });

    this.formulario = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)])
    });

  }
  
  ver() {
    this.accountService.listarUsuarios().subscribe((respuesta: User[]) => {
      this.users= respuesta;
    })
  }

  selectRow(index: number) {
    this.selectedRow = index;
  }

  updateUser(user:User) {
    this.accountService.updateUser(user).subscribe((respuesta: any) => {
      this.toastr.success('Cuenta modificada', 'Éxito');
      this.ver()
    })
  }

  update(){
    this.stateClear = true
  }

  clear(){
    this.formulario.reset();
    this.stateUpdate = false;
  }

  createUser() {
    let info = {
      username: this.formularioCrear.get('usernameCrear')!.value,
      email: this.formularioCrear.get('emailCrear')!.value,
    };

    console.log(info)

    this.accountService.createUser(info).subscribe((respuesta: any) => {
      
      /*error: mensaje de error
      info: mensaje informativo
      warning: mensaje de advertencia
      wait: mensaje de espera o carga
      progress: mensaje de progreso*/
      
      this.toastr.success('Cuenta creada', 'Éxito');
      this.ver();
    });
  }

  onImputChange() {
    this.stateCreate = this.formularioCrear.valid;
    this.stateUpdate = this.formulario.valid;
  }

  delete(id:string){
    this.stateDelete = true;
    this.accountService.delete(id).subscribe((respuesta: any) => {
      this.toastr.success('Cuenta eliminada', 'Éxito');
      this.ver()
    })
  }
}
