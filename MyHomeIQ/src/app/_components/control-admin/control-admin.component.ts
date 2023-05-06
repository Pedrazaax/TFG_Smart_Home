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

  username?:string;
  email?:string;

  formulario: FormGroup;
  users!: User[];
  selectedRow!: number;
  stateUpdate: boolean = false;
  stateCreate: boolean = false;
  stateDelete: boolean = false;

  ngOnInit(): void {
    this.ver()
  }

  constructor(private accountService: AccountService, private toastr: ToastrService) {
    
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
    this.stateUpdate = true
  }

  clear(){
    this.formulario.reset();
  }

  createUser() {
    let info = {
      username: this.username,
      email: this.email,
    };

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
    if (this.username && this.email) {
      this.stateCreate = true;
    } else {
      this.stateCreate = false;
    }
  }

  delete(id:string){
    this.stateDelete = true;
    this.accountService.delete(id).subscribe((respuesta: any) => {
      this.toastr.success('Cuenta eliminada', 'Éxito');
      this.ver()
    })
  }
}
