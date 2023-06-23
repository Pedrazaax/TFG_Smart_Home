import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';
import { ControlAdminComponent } from './_components/control-admin/control-admin.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { DispositivoComponent } from './_components/dispositivo/dispositivo.component';
import { ThermostatComponent } from './_components/thermostat/thermostat.component';
import { SocketComponent } from './_components/socket/socket.component';
import { InicioComponent } from './_components/inicio/inicio.component';
import { BulbComponent } from './_components/bulb/bulb.component';
import { IntroComponent } from './_components/intro/intro.component';
import { VideoCamaraComponent } from './_components/video-camara/video-camara.component';
import { AlarmComponent } from './_components/alarm/alarm.component';

const routes: Routes = [
  {path : 'login',component:LoginComponent},
  {path: '',redirectTo:'intro',pathMatch:'full'},
  {path : 'register',component:RegisterComponent},
  {path : 'control-admin',component:ControlAdminComponent},
  {path : 'sidebar',component:SidebarComponent},
  {path : 'panel',component:DispositivoComponent},
  {path : 'thermostat',component:ThermostatComponent},
  {path : 'socket',component:SocketComponent},
  {path : 'bulb',component:BulbComponent},
  {path : 'inicio',component:InicioComponent},
  {path : 'video',component:VideoCamaraComponent},
  {path : 'intro',component:IntroComponent},
  {path : 'alarm',component:AlarmComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
