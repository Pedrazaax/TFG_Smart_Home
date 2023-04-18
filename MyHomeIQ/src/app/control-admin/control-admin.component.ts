import { Component } from '@angular/core';
import { AccountService } from '../account.service';
import { User } from '../user';

@Component({
  selector: 'app-control-admin',
  templateUrl: './control-admin.component.html',
  styleUrls: ['./control-admin.component.css']
})
export class ControlAdminComponent {

  users!: User[];
  selectedRow!: number;

  ngOnInit(): void {
    this.ver()
  }

  constructor(private accountService: AccountService) { }
  
  ver() {
    this.accountService.listarUsuarios().subscribe((respuesta: User[]) => {
      this.users= respuesta;
    })
  }

  selectRow(index: number) {
    this.selectedRow = index;
    console.log(this.selectedRow)
  }

  updateUser() {

  }
}
