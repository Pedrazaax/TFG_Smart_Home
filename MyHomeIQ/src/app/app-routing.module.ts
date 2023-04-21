import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ControlAdminComponent } from './control-admin/control-admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DispositivoComponent } from './dispositivo/dispositivo.component';

const routes: Routes = [
  {path : 'login',component:LoginComponent},
  {path: '',redirectTo:'control-admin',pathMatch:'full'},
  {path : 'register',component:RegisterComponent},
  {path : 'control-admin',component:ControlAdminComponent},
  {path : 'sidebar',component:SidebarComponent},
  {path : 'dispositivo',component:DispositivoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
