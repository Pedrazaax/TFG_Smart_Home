import { Component } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-control-admin',
  templateUrl: './control-admin.component.html',
  styleUrls: ['./control-admin.component.css']
})
export class ControlAdminComponent {

  ngOnInit(): void {
  }

  constructor(private accountService: AccountService) { }
  
  ver() {
    this.accountService.listarUsuarios().subscribe(respuesta => {
      alert(respuesta)
      console.log(respuesta)
    },
      (error: any) => {
        alert("Error")
      }
    )
  }
}
