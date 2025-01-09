import { Component } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-control-admin',
  templateUrl: './control-admin.component.html',
  styleUrls: ['./control-admin.component.css']
})
export class ControlAdminComponent {
  Math = Math;
  
  // Propiedades de paginación
  currentPage: number = 0;
  itemsPerPage: number = 10;
  paginatedUsers: User[] = [];
  
  usernameCrear?: string;
  emailCrear?: string;
  formulario: FormGroup;
  formularioCrear: FormGroup;
  users!: User[];
  selectedRow!: number;
  stateUpdate: boolean = false;
  stateClear: boolean = false;
  stateCreate: boolean = false;
  stateDelete: boolean = false;
  roles = ['admin', 'user'];

  ngOnInit(): void {
    this.ver();
  }

  constructor(private accountService: AccountService, private toastr: ToastrService) {
    this.formularioCrear = new FormGroup({
      usernameCrear: new FormControl('', [Validators.required, Validators.minLength(4)]),
      emailCrear: new FormControl('', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]),
      passwordCrear: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      roleCrear: new FormControl('user', [Validators.required])
    }, this.passwordMatchValidator);

    this.formulario = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)])
    });
  }

  // Métodos de paginación
  nextPage() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.users.length) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  updatePaginatedUsers() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  ver() {
    this.accountService.listarUsuarios().subscribe((respuesta: User[]) => {
      this.users = respuesta;
      this.updatePaginatedUsers();
    });
  }

  selectRow(index: number) {
    this.stateUpdate = false;
    this.stateClear = true;
    this.selectedRow = index;
    this.ver();
  }

  updateUser(user: User) {
    this.accountService.updateUser(user).subscribe((respuesta: any) => {
      this.toastr.success('Cuenta modificada', 'Éxito');
      this.ver();
    });
  }

  update() {
    this.stateClear = true;
  }

  clear() {
    this.formulario.reset();
    this.stateUpdate = false;
  }

  passwordMatchValidator(g: AbstractControl) {
    const password = g.get('passwordCrear')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  createUser() {
    let info = {
      username: this.formularioCrear.get('usernameCrear')!.value,
      email: this.formularioCrear.get('emailCrear')!.value,
      password: this.formularioCrear.get('passwordCrear')!.value,
      role: this.formularioCrear.get('roleCrear')!.value
    };

    this.accountService.createUser(info).subscribe((respuesta: any) => {
      this.toastr.success('Cuenta creada', 'Éxito');
      this.ver();
    });
  }

  onImputChange() {
    this.stateCreate = this.formularioCrear.valid;
    this.stateUpdate = this.formulario.valid;
  }

  delete(id: string) {
    this.stateDelete = true;
    this.accountService.delete(id).subscribe((respuesta: any) => {
      this.toastr.success('Cuenta eliminada', 'Éxito');
      this.ver();
    });
  }
}
