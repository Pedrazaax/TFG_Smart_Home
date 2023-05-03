import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';
import { ControlAdminComponent } from './_components/control-admin/control-admin.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { DispositivoComponent } from './_components/dispositivo/dispositivo.component';

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
