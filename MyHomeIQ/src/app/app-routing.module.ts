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
import { ConsumoComponent } from './_components/consumo/consumo.component';
import { FormAPIComponent } from './_components/form-api/form-api.component';
import { AuthGuard } from './app.guard';
import { SensorComponent } from './_components/sensor/sensor.component';
import { ConsumoLocalComponent } from './_components/consumo-local/consumo-local.component';

const routes: Routes = [
  {path : 'login',component:LoginComponent},
  {path : '',redirectTo:'login',pathMatch:'full'},
  {path : 'register',component:RegisterComponent},
  {path : 'control-admin',component:ControlAdminComponent, canActivate: [AuthGuard]},
  {path : 'panel',component:DispositivoComponent, canActivate: [AuthGuard]},
  {path : 'thermostat',component:ThermostatComponent, canActivate: [AuthGuard]},
  {path : 'socket',component:SocketComponent, canActivate: [AuthGuard]},
  {path : 'bulb',component:BulbComponent, canActivate: [AuthGuard]},
  {path : 'inicio',component:InicioComponent, canActivate: [AuthGuard]},
  {path : 'video',component:VideoCamaraComponent, canActivate: [AuthGuard]},
  {path : 'intro',component:IntroComponent, canActivate: [AuthGuard]},
  {path : 'alarm',component:AlarmComponent, canActivate: [AuthGuard]},
  {path : 'consumo',component:ConsumoComponent, canActivate: [AuthGuard]},
  {path : 'api',component:FormAPIComponent, canActivate: [AuthGuard]},
  {path : 'sensor', component:SensorComponent, canActivate: [AuthGuard]},
  {path : 'consumo-local', component:ConsumoLocalComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
