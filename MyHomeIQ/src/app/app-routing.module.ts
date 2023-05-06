import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';
import { ControlAdminComponent } from './_components/control-admin/control-admin.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { DispositivoComponent } from './_components/dispositivo/dispositivo.component';
import { ThermostatComponent } from './_components/thermostat/thermostat.component';
import { SocketComponent } from './_components/socket/socket.component';

const routes: Routes = [
  {path : 'login',component:LoginComponent},
  {path: '',redirectTo:'control-admin',pathMatch:'full'},
  {path : 'register',component:RegisterComponent},
  {path : 'control-admin',component:ControlAdminComponent},
  {path : 'sidebar',component:SidebarComponent},
  {path : 'dispositivo',component:DispositivoComponent},
  {path : 'thermostat',component:ThermostatComponent},
  {path : 'socket',component:SocketComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
