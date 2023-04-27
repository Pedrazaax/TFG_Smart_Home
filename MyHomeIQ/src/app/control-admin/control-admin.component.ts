import { Component } from '@angular/core';
import { AccountService } from '../account.service';
import { User } from '../user';
import { FormGroup, FormControl } from '@angular/forms';

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
  state?: boolean;
  stateUpdate?: boolean;
  stateCreate?: boolean;
  

  ngOnInit(): void {
    this.ver()
  }

  constructor(private accountService: AccountService) {
    
    this.formulario = new FormGroup({
      username: new FormControl({disabled: this.state}),
      email: new FormControl({disabled: this.state})
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
      
    })
  }

  update(){
    this.state = false
    this.stateUpdate = true
    this.stateCreate = false
  }

  clear(){
    this.formulario.reset();
  }

  createUser(){
    let info = {
      username:this.username,
      email:this.email
    }

    this.accountService.createUser(info).subscribe((respuesta: any) => {
      this.ver()
    })
  }

  create(){
    this.stateUpdate = false;
    this.state = true;
    this.stateCreate = true;
  }

  delete(id:string){
    this.accountService.delete(id).subscribe((respuesta: any) => {
      this.ver()
    })
  }
}
